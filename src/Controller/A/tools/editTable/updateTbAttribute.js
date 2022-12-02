import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";
import getServerLoginInfo from "../../../Common/tools/user/getServerLoginInfo";

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


export const updateTbAttribute = async (loginInfo, tableName, scanResult, attrType) =>
{
	if (attrType == 'C') //범주속성에 맞게 업데이트
		await dbConnectQuery(getServerLoginInfo(),
		`
			UPDATE tb_attribute a
			SET a.attr_type = 'C',
			a.d_type = '${scanResult.attrType}',
			a.null_num = ${scanResult.numOfNullRecords},
			a.diff_num = ${scanResult.numOfDistinct},
			a.key_candidate = '${scanResult.recommended}',
			a.special_num = ${scanResult.numOfSpcRecords}
			WHERE a.attr_name = '${scanResult.attrName}'
			AND a.table_seq IN (
				SELECT table_seq
				FROM tb_scan sc
				WHERE sc.user_seq = ${loginInfo.user_seq}
				AND sc.table_name = '${tableName}'
			);
		`);
	else
	{
		await dbConnectQuery(getServerLoginInfo(),
		`
			UPDATE tb_attribute a
			SET a.attr_type = 'N',
			a.d_type = '${scanResult.attrType}',
			a.null_num = ${scanResult.numOfNullRecords},
			a.diff_num = ${scanResult.numOfDistinct},
			a.key_candidate = '${scanResult.recommended}',
			a.max_value = ${scanResult.max},
			a.min_value = ${scanResult.min},
			a.zero_num = ${scanResult.numOfZero}
			WHERE a.attr_name = '${scanResult.attrName}'
			AND a.table_seq IN (
				SELECT table_seq
				FROM tb_scan sc
				WHERE sc.user_seq = ${loginInfo.user_seq}
				AND sc.table_name = '${tableName}'
			);
		`);
	}

}
