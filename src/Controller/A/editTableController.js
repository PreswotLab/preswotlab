import getServerLoginInfo from "../Common/tools/user/getServerLoginInfo";
import {getTableNamesAndScanyn} from "./tools/domainScan/getTableNamesAndScanyn";
import {getRepAttrs} from "./tools/editTable/getRepAttrs";
import {getRepKeys} from "./tools/editTable/getRepKeys";
import dbConnectQuery from "../Common/tools/user/dBConnectQuery";
import {getNumOfRecords} from "./tools/domainScan/getNumOfRecords";
import {getNumericScanObject} from "./tools/domainScan/getNumericScanObject";
import { getCategoryScanObject } from "./tools/domainScan/getCategoryScanObject";
import { updateTbAttribute } from "./tools/editTable/updateTbAttribute";
import {getTableNamesScanned} from "./tools/editTable/getTableNamesScanned";

export const getEditTableHome = async (req, res) => {
	const tbNameScanYn = await getTableNamesScanned(req.session.loginInfo.user_seq);
	res.render('edit-table', { tbNameScanYn });
}

export const getEditTableRows = async (req, res) => {
	const { tableName } = req.params;
	const { user_seq } = req.session.loginInfo;
	const serverLoginInfo = getServerLoginInfo();
	try {
		const result = await dbConnectQuery(serverLoginInfo, 
		`
			SELECT 
			a.attr_seq,
			a.table_seq,
			sc.table_name,
			a.attr_name,
			a.attr_type,
			a.d_type,
			a.null_num,
			a.null_num / sc.row_num AS null_portion,
			a.diff_num,
			a.max_value,
			a.min_value,
			a.zero_num,
			a.zero_num / sc.row_num AS zero_portion,
			a.special_num,
			a.special_num / sc.row_num AS special_portion,
			a.rattr_seq,
			a.key_candidate,
			ra.rattr_name,
			m.mapping_seq,
			rk.rkey_seq,
			rk.rkey_name
			FROM tb_attribute a 
			LEFT OUTER JOIN tb_scan sc ON  a.table_seq = sc.table_seq
			LEFT OUTER JOIN tb_rep_attribute ra on ra.rattr_seq = a.rattr_seq 
			LEFT OUTER JOIN tb_mapping m on m.attr_seq = a.attr_seq 
			LEFT OUTER JOIN tb_rep_key rk on rk.rkey_seq = m.rkey_seq
			WHERE sc.table_name = '${tableName}'
			AND sc.user_seq = ${user_seq}
			AND sc.scan_yn = 'Y'
			AND m.chg_yn IS NULL OR m.chg_yn = 'N';`
			);
		const numericResult = [];
		const categoryResult = [];
		for (let i = 0; i < result.length; i++)
		{
			if (result[i]['attr_type'] == 'C')
				categoryResult.push(result[i]);
			else
				numericResult.push(result[i]);
		}
		const repAttrJoinKey = {
			repAttrArray : await getRepAttrs(),
			repKeyArray : await getRepKeys()
		};
		res.render('edit-table-result', { tableName, numericResult, categoryResult, repAttrJoinKey });
	} catch (e)
	{
		console.log(e.message);
		res.redirect('/logout');
	}
}

/*
 * 속성 삭제
 * req.session.loginInfo로 사용자 DB에 쿼리 날려야한다.
 * serverLoginInfo로 tb_attribute와 tb_mapping에 관련 속성을 삭제해야한다.
 * */
export const deleteAttr = async (req, res) => {
	try {
		const serverLoginInfo = getServerLoginInfo();
		const tableName = req.params.tableName;
		const attr_name = req.body.delAttr;//attr_name
		const user_seq = req.session.loginInfo.user_seq; //user_seq

		await dbConnectQuery(serverLoginInfo, 
		`
			DELETE
			FROM tb_mapping
			WHERE attr_seq IN 
			(
				SELECT at.attr_seq
				FROM tb_scan sc, tb_attribute at
				WHERE sc.table_seq = at.table_seq
				AND sc.user_seq = ${user_seq}
				AND sc.table_name = '${tableName}'
				AND at.attr_name = '${attr_name}'
			);
		`);
		await dbConnectQuery(serverLoginInfo,
		`
			DELETE FROM tb_attribute 
			WHERE attr_name = '${attr_name}'
			AND table_seq IN (
				SELECT table_seq 
				FROM tb_scan sc
				WHERE sc.user_seq = ${user_seq}
				AND sc.table_name = '${tableName}'
			);
		`);
		res.json({ status : 1 });
	} catch (e) {
		console.log(e.message);
		res.json({ status : 0 });
	}
};


/* req.body:
 * { modAttrName: 'PHONE_NUM', chgAttr: 'int(11)' }
 * */
export const modAttr = async (req, res) => {
	try {
		const {modAttrName, chgType} = req.body;
		const { loginInfo } = req.session;
		const {tableName} = req.params;

		//사용자 DB에서 속성 변경
		await dbConnectQuery(loginInfo, 
		`
			ALTER TABLE ${tableName}
			MODIFY COLUMN ${modAttrName}
			${chgType};
		`);

		//tb_attribute update
		const numOfRecords = await getNumOfRecords(loginInfo, tableName);

		//1. 수정한 속성이 수치속성인지 범주속성인지 사용자 DB에서 확인
		const is_category = await dbConnectQuery(loginInfo,
		`
			SHOW COLUMNS from ${tableName}
			WHERE Field = "${modAttrName}" #수정한 속성명
			AND (TYPE LIKE '%char%' 
			OR TYPE LIKE '%text%' 
			OR TYPE LIKE '%date%'
			OR TYPE LIKE '%set%'
			OR TYPE LIKE '%time%'
			OR TYPE LIKE 'binary'
			OR TYPE LIKE 'enum');
		`);

		if (is_category.length != 0) //범주속성으로 바뀐 경우 업데이트
		{
			const scanResult = await getCategoryScanObject(loginInfo, tableName, is_category[0], numOfRecords);
			await updateTbAttribute(loginInfo, tableName, scanResult, 'C');
			res.json({status : 1, scanResult, attrType : 'C'});
		}
		else //수치속성으로 바뀐 경우 업데이트
		{
			const is_numeric = await dbConnectQuery(loginInfo,
			`
				SHOW COLUMNS from ${tableName} 
				WHERE TYPE LIKE '%int%' 
				OR TYPE LIKE 'double%' 
				OR TYPE LIKE 'float%'
				OR TYPE LIKE 'boolean'
				OR TYPE LIKE 'bit'
				OR TYPE LIKE 'decimal';
			`);
			const scanResult = await getNumericScanObject(loginInfo, tableName, is_numeric[0], numOfRecords);
			await updateTbAttribute(loginInfo, tableName, scanResult, 'N');
			res.json({status : 1, scanResult, attrType : 'N'});
		}
	} catch (e) { //트랜젝션 도중 에러 -> 실패알림
		console.log(e.message);
		res.json({ status : 0 });
	}
}
