import dbConnectQuery from "../../Common/tools/user/dBConnectQuery"
import getServerLoginInfo from "../../Common/tools/user/getServerLoginInfo";
import dBConnectQueryPromise from "../../Common/tools/user/dBConnectQueryPromise"
import {Parser} from "json2csv";
import path from "path";

export const joinTable = async (req, loginInfo, res) => {

	console.log(req.body);
	console.log(loginInfo);

	const mysql = require('mysql');
	const pool = mysql.createPool(
		{
			user : loginInfo.dbUser,
			password : loginInfo.dbPassword,
			database : loginInfo.dbName,
			host : loginInfo.dbHostIp,
			port : parseInt(loginInfo.dbPort) || 3306
		});

	const json2csvParser = new Parser();
	const fs = require('fs');

	const tableSeqA = req.body.tableSeqA;
	const tableNameA = req.body.tableNameA;
	const tableSeqB = req.body.tableSeqB;
	const tableNameB = req.body.tableNameB;
	const attrSeqA = req.body.attrSeqA;
	const attrNameA = req.body.attrNameA;
	const attrSeqB = req.body.attrSeqB;
	const attrNameB = req.body.attrNameB;
	const rkeySeq = req.body.rkeySeq;
	const rkeyName = req.body.rkeyName;

	const viewName = `${tableSeqA}_${attrSeqA}_${tableSeqB}_${attrSeqB}`;

	// 두 테이블의 모든 attrName 가져오기(정렬해서)
	// const getAttrNameAllQuery = `
	// 	select *
	// 	from
	// 		(SELECT
	// 			 ta.attr_name,
	// 			 sc.table_seq
	// 		 FROM tb_scan sc
	// 				  INNER JOIN tb_attribute ta on sc.table_seq = ta.table_seq
	// 		 WHERE sc.table_seq = ${tableSeqA}
	// 		 UNION
	// 		 SELECT
	// 			 ta.attr_name,
	// 			 sc.table_seq
	// 		 FROM tb_scan sc
	// 				  INNER JOIN tb_attribute ta on sc.table_seq = ta.table_seq
	// 		 WHERE sc.table_seq = ${tableSeqB}) tb order by attr_name;
	// `

	// table A 개수 쿼리
	const getACountQuery = `
		SELECT
			sc.row_num
		FROM SERVER.tb_attribute a
			INNER JOIN SERVER.tb_scan sc ON a.table_seq = sc.table_seq
		WHERE a.attr_seq = ${attrSeqA}
		  	AND sc.table_seq = ${tableSeqA};
	`;

	// table B 개수 쿼리
	const getBCountQuery = `
		SELECT
			sc.row_num
		FROM SERVER.tb_attribute a
			INNER JOIN SERVER.tb_scan sc ON a.table_seq = sc.table_seq
		WHERE a.attr_seq = ${attrSeqB}
			AND sc.table_seq = ${tableSeqB};
	`;

	try {
		// 같은 join 결과 삭제
		const deleteQuery = `
			DELETE FROM tb_join
			WHERE view_name = '${viewName}'
				AND multi_yn = 'N';
		`
		await dbConnectQuery(getServerLoginInfo(), deleteQuery);
		console.log(deleteQuery);
		console.log("Delete exist Single Join")

		const countA = (await dBConnectQueryPromise(pool, getACountQuery))[0].row_num;
		const countB = (await dBConnectQueryPromise(pool, getBCountQuery))[0].row_num;

		const csv_path = path.join(__dirname, '..', 'joinCSV', `${viewName}.csv`)

		console.log(attrNameA);
		console.log(attrNameB);

		// join 결과 insert 쿼리
		const insertJoinQuery = `
			INSERT INTO SERVER.tb_join (
				p_join_seq,
				a_table_seq,
				a_attr_seq,
				a_count,
				b_table_seq,
				b_attr_seq,
				b_count,
				rkey_seq,
				result_count,
				state,
				view_name,
				multi_yn,
				rkey_name,
				success_rate_A,
				success_rate_B,
				a_attr_name,
				b_attr_name,
				a_table_name,
				b_table_name
			)
			VALUES (
					   last_insert_id(),
					   ${tableSeqA},
					   ${attrSeqA},
					   ${countA},
					   ${tableSeqB},
					   ${attrSeqB},
					   ${countB},
					   ${rkeySeq},
					   0,
					   'KEEP',
					   '${viewName}',
					   'N',
					   '${rkeyName}',
					   0,
					   0,
					   '${attrNameA}',
					   '${attrNameB}',
					   '${tableNameA}',
					   '${tableNameB}'
				   );
		`;

		// join 테이블에 join 결과 insert
		await dBConnectQueryPromise(pool, insertJoinQuery);

		// 1. Join
		await console.log("start join");
		let csv = await dBConnectQueryPromise(pool, `
			SELECT
				*
			FROM CLIENT.${tableNameA} A
			INNER JOIN CLIENT.${tableNameB} B ON A.${attrNameA} = B.${attrNameB};
		`);

		const countResult = csv.length
		const success_rate_A = (countResult / countA).toFixed(2)
		const success_rate_B = (countResult / countB).toFixed(2)

		csv = await json2csvParser.parse(csv);
		await fs.writeFile(csv_path, csv, function(err) {
			if (err) throw err;
			console.log(`${viewName} file saved`);
		})

		// 2. join 완료되면 진행중 -> 완료 update
		await console.log("start done");
		await dBConnectQueryPromise(pool, `
			UPDATE SERVER.tb_join
			SET state = 'DONE', result_count = ${countResult}, success_rate_A = ${success_rate_A}, success_rate_B = ${success_rate_B}
			where 
				join_seq = (SELECT MAX(join_seq)
							FROM SERVER.tb_join
							WHERE 
								multi_yn = 'N' and
								a_table_seq = ${tableSeqA} and
								a_attr_seq = ${attrSeqA} and 
								b_table_seq = ${tableSeqB} and
								b_attr_seq = ${attrSeqB})
		`);

	} catch (e)
	{
		console.log(e.message);
		res.redirect('/logout');
	}
}
