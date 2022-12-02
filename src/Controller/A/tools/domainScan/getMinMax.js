import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";
import { extractObjects } from "./extractObjects";

export const makeMinMax = async (loginInfo, tableName, attrName) =>
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
