import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";
import { extractObjects } from "./extractObjects";

export const getNumOfNullRecords = async (loginInfo, tableName, attrName) =>
{
	const result = await dbConnectQuery(loginInfo, 
	`
	SELECT COUNT(*) 
	FROM ${tableName}
	WHERE ${attrName} IS NULL;
	`);
	return (extractObjects(result, 'COUNT(*)')[0]);
};
