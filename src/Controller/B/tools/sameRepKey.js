import dbConnectQuery from "../../Common/tools/user/dBConnectQuery"
import getServerLoginInfo from "../../Common/tools/user/getServerLoginInfo";

export const sameRepKey = async (params, res) => {
	// 특정 repKey에 대한 join 할 수 있는 테이블 목록

	const query = `
		SELECT
			row_number() over(order by a.table_seq) as row,
			a.table_seq,
			sc.table_name,
			a.attr_seq,
			a.attr_name,
			rk.rkey_seq,
			rk.rkey_name,
			ra.rattr_seq,
			ra.rattr_name
		FROM tb_attribute a
				 INNER JOIN tb_mapping m ON a.attr_seq = m.attr_seq
				 INNER JOIN tb_rep_key rk ON m.rkey_seq = rk.rkey_seq
				 INNER JOIN tb_scan sc ON a.table_seq = sc.table_seq
				 LEFT OUTER JOIN tb_rep_attribute ra ON a.rattr_seq = ra.rattr_seq
		WHERE sc.scan_yn = 'Y'
		  AND m.chg_yn = 'N'
		  AND rk.rkey_seq = ${params.repKeySeq}
		  AND sc.table_seq != ${params.tableSeq};
	`;

	const serverLoginInfo = getServerLoginInfo();

	try {

		return await dbConnectQuery(serverLoginInfo, query);

	} catch (e)
	{
		console.log(e.message);
		res.redirect('/logout');
	}
}
