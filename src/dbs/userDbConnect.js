/*
 * DB종류에따라 연결을 수행
 * */

import MssqlLogin from "./dblogin/MssqlLogin"

export default async function userDbConnect(dbkind, dbconfig) {
	try {
		if (dbkind == 'MSSQL')
		{
			console.log("asdf")
			await MssqlLogin(dbconfig);
			console.log("asdf")
		}
	} catch (e) {
		throw(e)
	}
}

