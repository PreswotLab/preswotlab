import dbConnectQuery from "../user/dBConnectQuery"

/*
 * results[0] ==
 *	{
  'PHONE_NUM': '015-0019-9010',
  MAIL_ADDR: '04e8jlwv1qa6mxqrz2a@comcast.com',
  TEST_CNT: '2',
  CENTER_NM: 'KSPO송파',
  AGE_GBN: '성인',
  TEST_GBN: '일반',
  TEST_AGE: '29',
  INPUT_GBN: '없음',
  CERT_GBN: '3등급',
  TEST_YMD: '20210908',
  TEST_SEX: 'M'
	}
 *
 * */

const createRowNamesQuery = (keys) => {
	let rtn = "(";
	rtn = rtn.concat(keys.join(", "));
	rtn = rtn.concat(")")
	return (rtn);
}

const createValuesQuery = (results) => {
	let rtn = [];
	let tmp = "";

	for (let i = 0; i < results.length; i++)
	{
		tmp = "";
		tmp = tmp.concat("(\"");
		tmp = tmp.concat(Object.values(results[i]).join("\",\""))
		tmp = tmp.concat("\")");
		rtn.push(tmp.slice());
	}
	return (rtn.join(","));
}

export const insertRows = async (loginInfo, tableName, results) => {

	const rowNames = Object.keys(results[0]);
	const rowNamesQuery = createRowNamesQuery(rowNames);
	const valuesQuery = createValuesQuery(results);

	await dbConnectQuery(loginInfo,
	`
	INSERT INTO ${tableName} ${rowNamesQuery}
	VALUES ${valuesQuery};
	`)
}
