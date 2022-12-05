import { getCommonScanData } from "./getCommonScanData";
import { getNumPortionSpcRecords } from "./getSpcRecords";


/*
{
	attrName: 'TEST_AGE',
	attrType: 'text',
	numOfNullRecords: 0,
	portionOfNullRecords: 0,
	numOfDistinct: 76,
	recommended: 'n',
	numOfSpcRecords: 0,
	portionOfSpcRecords: 0
}
*/
export const getCategoryScanObject = async (loginInfo, tableName, fieldInfo, numOfRecords) =>
{
		return ({
			... await getCommonScanData(loginInfo, tableName, fieldInfo, numOfRecords),
			... await getNumPortionSpcRecords(loginInfo, tableName, fieldInfo.Field, numOfRecords),
		});
};
