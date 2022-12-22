import dbConnectQuery from "../../Common/tools/user/dBConnectQuery"
import getServerLoginInfo from "../../Common/tools/user/getServerLoginInfo";

export const searchTable = async (params, res) => {

	let query = `
			SELECT
				row_number() over(order by a.table_seq) as row,
				a.table_seq,
				sc.table_name,
				a.attr_seq,
				a.attr_name,
				rk.rkey_seq,
				rk.rkey_name,
				ra.rattr_seq,
				ra.rattr_name,
				sc.row_num
			FROM tb_attribute a
				INNER JOIN tb_mapping m ON a.attr_seq = m.attr_seq
				INNER JOIN tb_rep_key rk ON m.rkey_seq = rk.rkey_seq
				INNER JOIN tb_scan sc ON a.table_seq = sc.table_seq
				LEFT OUTER JOIN tb_rep_attribute ra ON a.rattr_seq = ra.rattr_seq
			WHERE sc.scan_yn = 'Y'
			  	AND m.chg_yn = 'N'
			`;


	if ( params.tableName !== undefined && params.tableName !== '' ) {
		query += `AND sc.table_name LIKE '%${params.tableName}%'\n`;
	}

	if ( params.repKeySeq !== undefined && params.repKeySeq !== '' ) {
		query += `AND rk.rkey_seq = ${params.repKeySeq}\n`
	}

	if ( params.repAttrSeq !== undefined && params.repAttrSeq !== '' ) {
		query += `AND ra.rattr_seq = ${params.repAttrSeq}\n`
	}

	if ( params.attrName !== undefined && params.attrName !== '' ) {
		query += `AND a.attr_name LIKE '%${params.attrName}%'`;
	}

	query += `;`;



	const serverLoginInfo = getServerLoginInfo();

	try {
		return await dbConnectQuery(serverLoginInfo, query);
	} catch (e)
	{
		console.log(e.message);
		res.redirect('/logout');
	}
}
