import { getCommonScanData } from "./getCommonScanData";
import { getNumPortionSpcRecords } from "./getSpcRecords";
import { getGeneralChrNum } from "./getGeneralChrNum";

export const makeCategoryScanObject = async (loginInfo, tableName, fieldInfo, numOfRecords) =>
{
		return ({
			... await getCommonScanData(loginInfo, tableName, fieldInfo, numOfRecords),
			... await getNumPortionSpcRecords(loginInfo, tableName, fieldInfo.Field, numOfRecords),
			... await getGeneralChrNum(loginInfo, tableName, fieldInfo.Field)

		});
};
