import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery"

/* 일반 문자의 개수를 저장한다.
 * */
export const getGeneralChrNum = async (loginInfo, tableName, attrName) => {
	const result = await dbConnectQuery(loginInfo,
		`
			SELECT count(*) AS cnt
			FROM ${tableName}
			WHERE ${attrName} REGEXP '[^0-9, ]';
		`);
	const numOfGenChrRecords = parseInt(result[0]['cnt']);
	return ({
		numOfGenChrRecords
	});
}
