/*
 * DB종류에따라 연결을 수행
 * */

import MariaMyLogin from "./dblogin/MariaLogin";
import MssqlLogin from "./dblogin/MssqlLogin"

export default async function userDbConnectQuery(dbkind, dbconfig, query) {
	try {
		if (dbkind == 'MSSQL')
			await MssqlLogin(dbconfig, query);
		else if (dbkind == 'MARIADB' || dbkind == 'MYSQL')
			await MariaMyLogin(dbconfig, query);
	} catch (e) {
		throw(e)
	}
}
