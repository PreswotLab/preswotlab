import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";

export const getNumOfRecords = async (loginInfo, tableName) =>
{
	const res = await dbConnectQuery(loginInfo, 
	`
		SELECT count(*) AS cnt
		FROM ${tableName};
	`);
	return (parseInt(res[0]['cnt']));
}
