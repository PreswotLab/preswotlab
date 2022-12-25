import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";
import {queryByDbConnObj} from "../../../Common/tools/user/queryByConnObj";

export const getNumOfRecords = async (loginInfo, tableName) =>
{
	const res = await dbConnectQuery(loginInfo, 
	`
		SELECT count(*) AS cnt
		FROM ${tableName};
	`);
	return (parseInt(res[0]['cnt']));
}

export const getNumOfRecordsByConn = async (userConn, tableName) =>
{
	const res = await queryByDbConnObj(userConn, 
	`
		SELECT count(*) AS cnt
		FROM ${tableName};
	`);
	return (parseInt(res[0]['cnt']));
}
