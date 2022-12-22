import dBConnectQueryPromise from "../../Common/tools/user/dBConnectQueryPromise"
import {Parser} from "json2csv";
import path from "path";

export const joinTableMulti = async (merged, loginInfo) => {

	console.log(merged);
	console.log(loginInfo);


	const mysql = require('mysql');
	const pool = mysql.createPool(
		{
			user : loginInfo.dbUser,
			password : loginInfo.dbPassword,
			database : loginInfo.dbName,
			host : loginInfo.dbHostIp,
			port : parseInt(loginInfo.dbPort) || 3306
		})
	
		
	const json2csvParser = new Parser();
    const fs = require('fs');

	const tableSeqA = merged.tableSeqA;
	const tableNameA = merged.tableNameA;
	const tableSeqB = merged.tableSeqB;
	const tableNameB = merged.tableNameB;
	const attrSeqA = merged.attrSeqA;
	const attrNameA = merged.attrNameA;
	const attrSeqB = merged.attrSeqB;
	const attrNameB = merged.attrNameB;
	const rkeySeq = merged.rkeySeq;


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

	// rkeyName 쿼리
	const getRKeyNameQuery = `
		SELECT
			rk.rkey_name
		FROM SERVER.tb_rep_key rk
		WHERE rk.rkey_seq = ${rkeySeq};
	`
	try {
		const rkeyName = (await dBConnectQueryPromise(pool, getRKeyNameQuery))[0].rkey_name;
		const countA = (await dBConnectQueryPromise(pool, getACountQuery))[0].row_num;
		const countB = (await dBConnectQueryPromise(pool, getBCountQuery))[0].row_num;
		
		const viewName = `${tableSeqA}_${attrSeqA}_${tableSeqB}_${attrSeqB}`;
		const csv_path = path.join(__dirname, '..', 'multiJoinCSV', `${viewName}.csv`)

		console.log(attrNameA);
		console.log(attrNameB);

		// 0. join 이전에 진행
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
				'Y',
				'${rkeyName}',
				0,
				0,
				'${attrNameA}',
				'${attrNameB}',
				'${tableNameA}',
				'${tableNameB}'
			);
		`;
		await console.log("start insertJoinQuery");
		await dBConnectQueryPromise(pool, insertJoinQuery);
		
		// 1. Join
		await console.log("start join");
		let csv = await dBConnectQueryPromise(pool, `
			SELECT
				*
			FROM CLIENT.${tableNameA} A
			INNER JOIN CLIENT.${tableNameB} B ON A.${attrNameA} = B.${attrNameB};
		`)

		const countResult = csv.length
		const success_rate_A = await (countResult / countA).toFixed(2)
		const success_rate_B = await (countResult / countB).toFixed(2)

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
								multi_yn = 'Y' and
								a_table_seq = ${tableSeqA} and
								a_attr_seq = ${attrSeqA} and 
								b_table_seq = ${tableSeqB} and
								b_attr_seq = ${attrSeqB})
		`);
		await console.log("fin");

		await pool.getConnection(function(err,connection){
			if(!err){
			  //connected!
			}
			// 커넥션을 풀에 반환
			connection.release();
		});


	} catch (e)
	{
		console.log(e.message);
	}
}
