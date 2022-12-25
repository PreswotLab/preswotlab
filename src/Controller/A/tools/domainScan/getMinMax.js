import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";
import {queryByDbConnObj} from "../../../Common/tools/user/queryByConnObj";
import { extractObjects } from "./extractObjects";

export const getMinMax = async (loginInfo, tableName, attrName) =>
{
	const result = await dbConnectQuery(loginInfo,
	`
		SELECT MAX(${attrName}), MIN(${attrName})
		FROM ${tableName};
	`);
	return ({
		max : extractObjects(result, `MAX(${attrName})`)[0],
		min : extractObjects(result, `MIN(${attrName})`)[0]
	});
};

export const getMinMaxByConn = async (userConn, tableName, attrName) =>
{
	const result = await queryByDbConnObj(userConn,
	`
		SELECT MAX(${attrName}), MIN(${attrName})
		FROM ${tableName};
	`);
	return ({
		max : extractObjects(result, `MAX(${attrName})`)[0],
		min : extractObjects(result, `MIN(${attrName})`)[0]
	});
};

