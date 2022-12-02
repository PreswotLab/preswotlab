import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery"

export const getNumPortionSpcRecords = async (loginInfo, tableName, attrName, numOfRecords) =>
{
	const result = await dbConnectQuery(loginInfo, 
		`
			SELECT count(*) AS cnt
			FROM ${tableName}
			WHERE ${attrName} REGEXP '[^0-9a-zA-Z, ]';
		`);
	const numOfSpcRecords = parseInt(result[0]['cnt']);
	return ({
		numOfSpcRecords,
		portionOfSpcRecords : numOfSpcRecords / numOfRecords
	})
}
