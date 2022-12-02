import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";

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
