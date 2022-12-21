import dbConnectQuery from "../../Common/tools/user/dBConnectQuery"
import getServerLoginInfo from "../../Common/tools/user/getServerLoginInfo";

export const joinTable = async (req, res) => {

	const tableSeqA = req.body.tableSeqA;
	const tableNameA = req.body.tableNameA;
	const tableSeqB = req.body.tableSeqB;
	const tableNameB = req.body.tableNameB;
	const attrSeqA = req.body.attrSeqA;
	const attrNameA = req.body.attrNameA;
	const attrSeqB = req.body.attrSeqB;
	const attrNameB = req.body.attrNameB;
	const rkeySeq = req.body.rkeySeq;

	const viewName = `${tableSeqA}_${attrSeqA}_${tableSeqB}_${attrSeqB}`;

	// CLIENT에서 VIEW 생성 쿼리
	const clientQuery = `
		CREATE VIEW ${viewName} AS
			SELECT
				*
			FROM ${tableNameA} A
				INNER JOIN ${tableNameB} B ON A.${attrNameA} = B.${attrNameB};
			`;

	// table A 개수 쿼리
	const getACountQuery = `
		SELECT
    		sc.row_num
 	    FROM tb_attribute a
			INNER JOIN tb_scan sc ON a.table_seq = sc.table_seq
     	WHERE a.attr_seq = ${attrSeqA}
       		AND sc.table_seq = ${tableSeqA};
	`;

	// table B 개수 쿼리
	const getBCountQuery = `
		SELECT
    		sc.row_num
 	    FROM tb_attribute a
			INNER JOIN tb_scan sc ON a.table_seq = sc.table_seq
     	WHERE a.attr_seq = ${attrSeqB}
       		AND sc.table_seq = ${tableSeqB};
	`;

	// rkeyName 쿼리
	const getRKeyNameQuery = `
		SELECT
    		rk.rkey_name
		FROM tb_rep_key rk
		WHERE rk.rkey_seq = ${rkeySeq};
	`

	const serverLoginInfo = getServerLoginInfo();

	try {
		// 기존 view 삭제
		await dbConnectQuery(req.session.loginInfo, `
			DROP VIEW if exists ${viewName};
		`);

		// view 생성
		await dbConnectQuery(req.session.loginInfo, clientQuery);

		const rkeyName = (await dbConnectQuery(serverLoginInfo, getRKeyNameQuery))[0].rkey_name;
		const countA = (await dbConnectQuery(serverLoginInfo, getACountQuery))[0].row_num;
		const countB = (await dbConnectQuery(serverLoginInfo, getBCountQuery))[0].row_num;

		// VIEW의 크기
		const countResult = Number((await dbConnectQuery(req.session.loginInfo, `select count(*) as cnt from ${viewName};`))[0].cnt);

		// join 결과 insert 쿼리
		const insertJoinQuery = `
			INSERT INTO tb_join (
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
				view_name      
			) VALUES (
			 	last_insert_id(),
				${tableSeqA},
				${attrSeqA},
				${countA},
				${tableSeqB},
				${attrSeqB},
				${countB},
				${rkeySeq},
				${countResult},
			    'DONE',
				'${viewName}'  
			);
		`;

		// join 테이블에 join 결과 insert
		await dbConnectQuery(serverLoginInfo, insertJoinQuery);

		// join 정보 return
		return {
			table_name_A: tableNameA,
			total_num_A: countA,
			attr_name_A: attrNameA,
			table_name_B: tableNameB,
			total_num_B: countB,
			attr_name_B: attrNameB,
			rkey_name: rkeyName,
			result_num: countResult,
			success_rate_A: (countResult / countA).toFixed(2),
			success_rate_B: (countResult / countB).toFixed(2),
			state: 'DONE',
			view_name: viewName
		};

	} catch (e)
	{
		console.log(e.message);
		res.redirect('/logout');
	}
}
