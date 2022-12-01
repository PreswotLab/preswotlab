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
			tb.mapping_seq,
			tb.rkey_seq,
			tb.rkey_name
			FROM tb_attribute a
			INNER JOIN tb_scan sc ON a.table_seq = sc.table_seq
			LEFT OUTER JOIN tb_rep_attribute ra ON a.rattr_seq = ra.rattr_seq # rattr_seq이 없을 수 있기 때문에 LEFT OUTER JOIN
			LEFT OUTER JOIN # mapping이 안되어 있을 수 있기 때문에 LEFT OUTER JOIN
			(SELECT
				 m.mapping_seq,
				 m.rkey_seq,
				 m.attr_seq,
				 m.table_seq,
				 m.chg_yn,
				 rk.rkey_name
				FROM tb_mapping m
				INNER JOIN tb_rep_key rk ON m.rkey_seq = rk.rkey_seq
				WHERE m.chg_yn = 'N' # mapping은 단 하나만 존재해야 한다 / mapping 변경되면 'Y'로 바꿔줘야 함
				) tb
			ON a.attr_seq = tb.attr_seq 
			and a.table_seq = tb.table_seq
			WHERE
			sc.user_seq = ${user_seq} and # 파라미터 이용
			sc.table_name = '${tableName}' and # 파라미터 이용
			sc.scan_yn = 'Y' # scan 된 것만 가져온다.`);
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
		console.log(req.body);
		res.send({ status : 1 });
	} catch (e) {
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
