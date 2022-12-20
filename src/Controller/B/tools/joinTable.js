import dbConnectQuery from "../../Common/tools/user/dBConnectQuery"
import getServerLoginInfo from "../../Common/tools/user/getServerLoginInfo";

export const joinTable = async (params, res) => {

	const tableSeqA = params.tableSeqA;
	const tableNameA = params.tableNameA;
	const tableSeqB = params.tableSeqB;
	const tableNameB = params.tableNameB;
	const attrSeqA = params.attrSeqA;
	const attrNameA = params.attrNameA;
	const attrSeqB = params.attrSeqB;
	const attrNameB = params.attrNameB;
	const rkeySeq = params.rkeySeq;

	// CLIENT에서 조인
	const clientQuery = `
		SELECT
			*,
			row_number() over(order by A.${attrNameA}) as ROW
		FROM
			${tableNameA} A
				INNER JOIN ${tableNameB} B ON A.${attrNameA} = B.${attrNameB};
			`;

	const serverQuery = `
		SELECT
			A.table_name AS talbe_name_A,
			A.total_num AS total_num_A,
			A.attr_name AS attr_name_A,
			B.table_name AS talbe_name_B,
			B.total_num AS total_num_B,
			B.attr_name AS attr_name_B,
			A.rkey_name,
			F.file_name,
			F.file_path
		FROM
			(SELECT
				a.table_seq,
				sc.table_name,
				a.attr_seq,
				a.attr_name,
				a.total_num,
				rk.rkey_seq,
				rk.rkey_name
			FROM tb_attribute a
				INNER JOIN tb_scan sc ON a.table_seq = sc.table_seq
				INNER JOIN tb_mapping m ON a.attr_seq = m.attr_seq
				INNER JOIN tb_rep_key rk ON m.rkey_seq = rk.rkey_seq
			WHERE a.attr_seq = ${attrSeqA}
				AND rk.rkey_seq = ${rkeySeq}
				AND sc.table_seq = ${tableSeqA}) A
    	LEFT JOIN
			(SELECT
				a.table_seq,
				sc.table_name,
				a.attr_seq,
				a.attr_name,
				a.total_num,
				rk.rkey_seq,
				rk.rkey_name
			FROM tb_attribute a
				INNER JOIN tb_scan sc ON a.table_seq = sc.table_seq
				INNER JOIN tb_mapping m ON a.attr_seq = m.attr_seq
				INNER JOIN tb_rep_key rk ON m.rkey_seq = rk.rkey_seq
			WHERE a.attr_seq = ${attrSeqB}
				AND rk.rkey_seq = ${rkeySeq}
			  	AND sc.table_seq = ${tableSeqB}) B
		ON A.rkey_seq = B.rkey_seq;
	`;

	const serverLoginInfo = getServerLoginInfo();

	try {
		const clientResult = await(dbConnectQuery(serverLoginInfo, clientQuery));

		console.log("결과");
		console.log(clientResult);

		const serverResult = await dbConnectQuery(serverLoginInfo, serverQuery);

		const count = clientResult.length;
		serverResult.result_num = count;
		serverResult.success_rate_A = serverResult.total_num_A / count;
		serverResult.success_rate_B = serverResult.total_num_B / count;
		serverResult.state = "DONE";


		// csv file 생성 및 저장

		// tb_file에 저장

		// tb_join 저장

		return joinInfo;

	} catch (e)
	{
		console.log(e.message);
		res.redirect('/logout');
	}
}
