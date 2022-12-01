import getServerLoginInfo from "../Common/tools/user/getServerLoginInfo";
import {getTableNamesAndScanyn} from "./tools/domainScan/getTableNamesAndScanyn";
import {getRepAttrs} from "./tools/editTable/getRepAttrs";
import {getRepKeys} from "./tools/editTable/getRepKeys";
import dbConnectQuery from "../Common/tools/user/dBConnectQuery";

export const getEditTableHome = async (req, res) => {
	const tbNameScanYn = await getTableNamesAndScanyn(req.session.loginInfo.user_seq);
	console.log(tbNameScanYn);
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
		console.log(req.body);
		const table_name = req.params.tableName;
		console.log(req.params);
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
				AND sc.table_name = '${table_name}'
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
				AND sc.table_name = '${table_name}'
			);
		`);
		res.send({ status : 1 });
	} catch (e) {
		console.log(e.message);
		res.send({ status : 0 });
	}
};

export const modAttr = async (req, res) => {
	try {
		console.log(req.body);
		res.send({ status : 1 });
	} catch (e) {
		res.send({ status : 0 });
	}
}
