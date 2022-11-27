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

import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";
import {extractObjects} from "./extractObjects";

const getTableNames = async (loginInfo) => {
	const result = await dbConnectQuery(loginInfo, 'SHOW tables;');

	const tableNames = extractObjects(result, `Tables_in_${loginInfo.dbName}`);
	console.log(tableNames);
	return (tableNames);
};

export default getTableNames;
