import { getCommonScanData, getCommonScanDataByConn } from "./getCommonScanData";
import { getMinMax, getMinMaxByConn } from "./getMinMax";
import { getNumOfZero, getNumOfZeroByConn } from "./getNumOfZero";


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

export const getNumericScanObjectByConn = async (userConn, tableName, fieldInfo, numOfRecords) =>
{
		return ({
			... await getCommonScanDataByConn(userConn, tableName, fieldInfo, numOfRecords),
			... await getMinMaxByConn(userConn, tableName, fieldInfo.Field),
			... await getNumOfZeroByConn(userConn, tableName, fieldInfo.Field, numOfRecords)
		});
};
