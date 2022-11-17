/*
 * Query Result = 
 * [
 *		{Tables_in_dbserver : tablename1},
 *		{Tables_in_dbserver : tablename2},
 *		....
 *		meta : [
 *			...
 *			...
 *		]
 * ];
 * */

import dbConnectQuery from "../../dbs/dbConnectQuery";

const getTableNames = async (loginInfo) => {
	let tableNames = [];
	let i;

	const result = await dbConnectQuery(loginInfo, 'SHOW tables;');
	console.log(result)
	i = 0;
	while (true)
	{
		if (typeof(result[i]) == 'object')
			tableNames.push(result[i][`Tables_in_${loginInfo.dbName}`])
		else
			break;
		i++;
	}
	return (tableNames);
};

export default getTableNames;
