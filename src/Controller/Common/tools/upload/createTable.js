import dbConnectQuery from "../user/dBConnectQuery"

export const removeBomUtf8 = (str) =>
{
	const utfBom = '\xEF\xBB\xBF'
  if(str.substring(0,3) == utfBom)
	{
       return str.substring(3);
   }else{
       return str;
   }
}

export const createTable = async (loginInfo, tableName, result) => {
	const cols = Object.keys(result);
	let test = "";
	for (let i = 0; i < cols.length; i++)
	{
		test = test.concat(`${cols[i].toUpperCase()} TEXT`);
		if (cols[i + 1])
			test = test.concat(", ");
	}
	/*
	 * 테이블 생성
	 * */
	await dbConnectQuery (loginInfo,
	`
		CREATE TABLE ${removeBomUtf8(tableName)} (
		${test}
		);
	`);
	await dbConnectQuery (loginInfo,
	`
		ALTER TABLE ${removeBomUtf8(tableName)} convert to charset utf8mb4;
	`
	)
}
