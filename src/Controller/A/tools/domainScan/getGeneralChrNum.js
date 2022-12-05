import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery"

/* 일반 문자의 개수를 저장한다.
 * */
export const getGeneralChrNum = async (loginInfo, tableName, attrName) => {
	const result = await dbConnectQuery(loginInfo,
		`
			SELECT count(*) AS cnt
			FROM ${tableName} #double형, 정수형이 아닌 칼럼의 개수입니다, 이 값이 하나라도 있으면 안됩니다.
			WHERE ${attrName} REGEXP '[^[0-9]*[.]?[0-9]+$]';
		`);
	const numOfGenChrRecords = parseInt(result[0]['cnt']);
	return ({
		numOfGenChrRecords
	});
}
