import { getNumOfNullRecords } from "./getNumOfNullRecords";
import { getNumOfDistinct } from "./getNumOfDistinct";

export const getCommonScanData = async (loginInfo, tableName, fieldInfo, numOfRecords) =>
{
	const attrName = fieldInfo.Field;
	const attrType = fieldInfo.Type;
	const numOfNullRecords = parseInt(await getNumOfNullRecords(loginInfo, tableName, attrName));
	const portionOfNullRecords = parseInt(numOfNullRecords) / numOfRecords;
	const numOfDistinct = await getNumOfDistinct(loginInfo, tableName, attrName);
	return ({
		attrName,
		attrType,
		numOfNullRecords,
		portionOfNullRecords,
		numOfDistinct,
		recommended : (numOfDistinct / numOfRecords > 0.9) ? 'Y' : 'N'
	});
};
