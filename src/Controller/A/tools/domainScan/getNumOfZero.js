import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";
import {queryByDbConnObj} from "../../../Common/tools/user/queryByConnObj";

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

export const getNumOfZeroByConn = async (userConn, tableName, attrName, numOfRecords) => {
	const result = await queryByDbConnObj(userConn,
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
