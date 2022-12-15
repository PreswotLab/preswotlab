import getServerLoginInfo from "../Common/tools/user/getServerLoginInfo";
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
	const { tableName, tableSeq } = req.params;
	const serverLoginInfo = getServerLoginInfo();
	try {
		const result = await dbConnectQuery(serverLoginInfo, 
		`
		select
		tb.attr_seq,
		tb.table_seq,
		tb.table_name,
		tb.attr_name,
		tb.attr_type,
		tb.d_type,
		tb.null_num,
		tb.null_num / tb.row_num AS null_portion,
		tb.diff_num,
		tb.max_value,
		tb.min_value,
		tb.zero_num,
		tb.zero_num / tb.row_num AS zero_portion,
		tb.special_num,
		tb.special_num / tb.row_num AS special_portion,
		m.mapping_seq,
		tb.rattr_seq,
		tb.key_candidate,
		ra.rattr_name,
		rk.rkey_seq,
		rk.rkey_name
		from
		(select
		a.attr_seq,
		a.table_seq,
		sc.table_name,
		sc.row_num,
		a.attr_name,
		a.attr_type,
		a.d_type,
		a.null_num,
		a.diff_num,
		a.max_value,
		a.min_value,
		a.zero_num,
		a.special_num,
		a.rattr_seq,
		a.key_candidate
		from tb_attribute a
		inner join tb_scan sc 
		on a.table_seq = sc.table_seq
		WHERE sc.table_seq = '${tableSeq}'
		AND sc.scan_yn = 'Y') tb
		LEFT OUTER JOIN tb_rep_attribute ra on ra.rattr_seq = tb.rattr_seq
		LEFT OUTER JOIN tb_mapping m on m.attr_seq = tb.attr_seq
		AND m.chg_yn = 'N'
		LEFT OUTER JOIN tb_rep_key rk on rk.rkey_seq = m.rkey_seq
		;`
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
		res.render('edit-table-result', { tableName, tableSeq, numericResult, categoryResult, repAttrJoinKey });
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
	const serverLoginInfo = getServerLoginInfo();
	const { tableSeq } = req.params;
	const { delAttr } = req.body;//attr_name

	try {

		//mapping 삭제
		await dbConnectQuery(serverLoginInfo, 
		`
			DELETE
			FROM tb_mapping
			WHERE attr_seq IN 
			(
				SELECT attr_seq
				FROM tb_attribute 
				WHERE table_seq = ${tableSeq} 
				AND attr_name = '${delAttr}'
			);
		`);
		//속성 삭제
		await dbConnectQuery(serverLoginInfo,
		`
			DELETE FROM tb_attribute 
			WHERE attr_name = '${delAttr}'
			AND table_seq = ${tableSeq}
			;
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
	const { modAttrName, chgType } = req.body;
	const { loginInfo } = req.session;
	const { tableName, tableSeq } = req.params;
	try {
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
			await updateTbAttribute(tableSeq, scanResult, 'C');
			res.json({status : 1, scanResult, attrType : 'C'});
		}
		else //수치속성으로 바뀐 경우 업데이트
		{
			const is_numeric = await dbConnectQuery(loginInfo,
			`
				SHOW COLUMNS from ${tableName} 
				WHERE Field = "${modAttrName}" #수정한 속성명
				AND (TYPE LIKE '%int%'
				OR TYPE LIKE 'double%' 
				OR TYPE LIKE 'float%'
				OR TYPE LIKE 'boolean'
				OR TYPE LIKE 'bit'
				OR TYPE LIKE 'decimal')
				;
			`);
			console.log(tableSeq);
			const scanResult = await getNumericScanObject(loginInfo, tableName, is_numeric[0], numOfRecords);
			console.log(scanResult)
			await updateTbAttribute(tableSeq, scanResult, 'N');
			res.json({status : 1, scanResult, attrType : 'N'});
		}
	} catch (e) { //트랜젝션 도중 에러 -> 실패알림
		console.log(e.message);
		res.json({ status : 0 });
	}
}
