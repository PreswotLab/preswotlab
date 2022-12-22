import dbConnectQuery from "../../Common/tools/user/dBConnectQuery"
import getServerLoginInfo from "../../Common/tools/user/getServerLoginInfo";

export const searchJoin = async (params, isMulti, res) => {

	console.log(params);

	let query = ``;

	console.log(params.tableName);

	if ( params.tableName !== undefined && params.tableName !== '' ) {
		query += `AND (a_table_name LIKE '%${params.tableName}%' OR b_table_name LIKE '%${params.tableName}%') `;
	}

	if ( params.minSuccessRate !== undefined && params.minSuccessRate !== '' ) {
		query += `AND success_rate_A >= ${params.minSuccessRate} AND success_rate_B >= ${params.minSuccessRate} `
	}
	
	if ( params.minCount !== undefined && params.minCount !== '' ) {
		query += `AND result_count >= ${params.minCount}`
	}


	console.log("################################################################");
	console.log("query : ");
	console.log(query);
	console.log("################################################################");
	


	let searchQuery = `
		SELECT MAX(join_seq), a_table_name, a_attr_name, b_table_name, b_attr_name, a_count, b_count, rkey_name, result_count, success_rate_A, success_rate_B, state, view_name
		FROM SERVER.tb_join
		WHERE multi_yn = '${isMulti}' ${query}                 
		GROUP BY a_table_seq, a_attr_seq, b_table_seq, b_attr_seq
	`;
	
	console.log('searchJoin.js');
	console.log("search query : ");
	console.log(searchQuery);

	const serverLoginInfo = getServerLoginInfo();

	try {
		return await dbConnectQuery(serverLoginInfo, searchQuery);
	} catch (e)
	{
		console.log(e.message);
		res.redirect('/logout');
	}
}
