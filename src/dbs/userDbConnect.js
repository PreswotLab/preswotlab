/*
 * DB종류에따라 연결을 수행
 * */

import MariaMyLogin from "./dblogin/MariaLogin";
import MssqlLogin from "./dblogin/MssqlLogin"
import getDbConfigBySession from "./getDbConfigBySession";

const dbConnectQuery = async(loginInfo, query) => {
	let result;

	const dbconfig = getDbConfigBySession(loginInfo);
	console.log(loginInfo, dbconfig, query)
	try {
		if (loginInfo.dbKind == 'MSSQL')
			result = await MssqlLogin(dbconfig, query);
		else if (loginInfo.dbKind == 'MARIADB' || loginInfo.dbKind == 'MYSQL')
			result = await MariaMyLogin(dbconfig, query);
		if (query)
			return (result);
	} catch (e) {
		throw(e)
	}
}

export default dbConnectQuery;
