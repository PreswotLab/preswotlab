import { getCommonScanData } from "./getCommonScanData";
import { getMinMax } from "./getMinMax";
import { getNumOfZero } from "./getNumOfZero";


/*
{
	attrName: 'TEST_CNT',
	attrType: 'int(11)',
	numOfNullRecords: 0,
	portionOfNullRecords: 0,
	numOfDistinct: 20,
	recommended: 'n',
	max: 40,
	min: 1,
	numOfZero: 0,
	portionOfZero: 0
}
*/

export const getNumericScanObject = async (loginInfo, tableName, fieldInfo, numOfRecords) =>
{
		return ({
			... await getCommonScanData(loginInfo, tableName, fieldInfo, numOfRecords),
			... await getMinMax(loginInfo, tableName, fieldInfo.Field),
			... await getNumOfZero(loginInfo, tableName, fieldInfo.Field, numOfRecords)
		});
};
