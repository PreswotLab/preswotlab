import { getCommonScanData } from "./getCommonScanData";
import { getMinMax } from "./getMinMax";
import { getNumOfZero } from "./getNumOfZero";

export const makeNumericScanObject = async (loginInfo, tableName, fieldInfo, numOfRecords) =>
{
		return ({
			... await getCommonScanData(loginInfo, tableName, fieldInfo, numOfRecords),
			... await getMinMax(loginInfo, tableName, fieldInfo.Field),
			... await getNumOfZero(loginInfo, tableName, fieldInfo.Field, numOfRecords)
		});
};
