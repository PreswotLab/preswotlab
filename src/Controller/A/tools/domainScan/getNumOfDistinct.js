import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";
import {queryByDbConnObj} from "../../../Common/tools/user/queryByConnObj";

export const getNumOfDistinct = async (loginInfo, tableName, attrName) =>
{
	const result = await dbConnectQuery(loginInfo,
	`
	SELECT DISTINCT ${attrName}
	FROM ${tableName};
	;
	`);
	return (result.length);
};

export const getNumOfDistinctByConn = async (userConn, tableName, attrName) =>
{
	const result = await queryByDbConnObj(userConn,
	`
	SELECT DISTINCT ${attrName}
	FROM ${tableName};
	;
	`);
	return (result.length);
};

