/*
 * DB종류에따라 연결을 수행
 * */

import MariaMyLogin from "./dblogin/MariaLogin";
import MssqlLogin from "./dblogin/MssqlLogin"

export default async function userDbConnect(dbkind, dbconfig) {
	try {
		if (dbkind == 'MSSQL')
			await MssqlLogin(dbconfig, null);
		else if (dbkind == 'MARIADB' || dbkind == 'MYSQL')
			await MariaMyLogin(dbconfig, null);
	} catch (e) {
		throw(e)
	}
}
