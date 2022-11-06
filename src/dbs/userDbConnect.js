/*
 * DB종류에따라 연결을 수행
 * */

import MariaLogin from "./dblogin/MariaLogin";
import MssqlLogin from "./dblogin/MssqlLogin"

export default async function userDbConnect(dbkind, dbconfig) {
	try {
		if (dbkind == 'MSSQL')
			await MssqlLogin(dbconfig, null);
		else if (dbkind == 'MARIADB')
			await MariaLogin(dbconfig, null);
	} catch (e) {
		throw(e)
	}
}

