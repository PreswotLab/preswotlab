/*
 * DB종류에따라 연결을 수행
 * */

import MariaMyLogin from "./dblogin/MariaLogin";
import MssqlLogin from "./dblogin/MssqlLogin"

const dbConnectQuery = async(dbkind, dbconfig, query) => {
	let result;

	try {
		if (dbkind == 'MSSQL')
			result = await MssqlLogin(dbconfig, query);
		else if (dbkind == 'MARIADB' || dbkind == 'MYSQL')
			result = await MariaMyLogin(dbconfig, query);
		if (query)
			return (result);
	} catch (e) {
		throw(e)
	}
}

export default dbConnectQuery;
