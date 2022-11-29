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
	console.log("tableName: ", tableName);
	console.log("userseq : ", user_seq);

	try {
		const result = await dbConnectQuery(serverLoginInfo, 
			`
			SELECT
			a.attr_name, 
			a.attr_type, 
			a.d_type, 
			a.null_num, 
			a.null_num / sc.row_num AS null_portion, 
			diff_num, 
			a.special_num, 
			a.special_num / sc.row_num AS special_portion, 
			a.max_value, 
			a.min_value, 
			a.zero_num, 
			a.zero_num / sc.row_num AS zero_portion, 
			a.key_candidate, 
			ra.rattr_name, 
			rk.rkey_name 
			FROM tb_scan sc, tb_attribute a, tb_mapping m, tb_rep_key rk, tb_rep_attribute ra
			WHERE sc.user_seq = ${user_seq} 
			AND sc.table_name = '${tableName}'
			AND sc.table_seq = a.table_seq 
			AND a.attr_seq = m.attr_seq 
			AND m.rkey_seq = rk.rkey_seq 
			AND a.rattr_seq = ra.rattr_seq;
			`);
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
		console.log(result);
		res.render('edit-table-view', { tableName, numericResult, categoryResult, repAttrJoinKey });
	} catch (e)
	{
		console.log(e.message);
		res.redirect('/logout');
	}
}

/*
 * 속성 삭제
 * req.session.loginInfo로 사용자 DB에 쿼리 날려야한다.
 * */
export const deleteAttr = async (req, res) => {

};

export const modAttr = async (req, res) => {

}
