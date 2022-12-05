import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";

export const getNumOfZero = async (loginInfo, tableName, attrName, numOfRecords) => {
	const result = await dbConnectQuery(loginInfo,
	`SELECT * 
	FROM ${tableName} 
	WHERE ${attrName} = 0;
	`);
	const numOfZero = result.length;
	return ({
		numOfZero,
		portionOfZero : numOfZero / numOfRecords
	});
}
