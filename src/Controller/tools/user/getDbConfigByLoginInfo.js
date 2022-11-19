const getDbConfigByLoginInfo = (loginInfo) => {

	if (loginInfo.dbKind == 'MSSQL')
	{
		return ({
			user : loginInfo.dbUser,
			password : loginInfo.dbPassword,
			database : loginInfo.dbName,
			server : loginInfo.dbHostIp,
			port : parseInt(loginInfo.dbPort) || 1433
		})
	}
	else //mariadb, mysql용
	{
		return ({
			user : loginInfo.dbUser,
			password : loginInfo.dbPassword,
			database : loginInfo.dbName,
			host : loginInfo.dbHostIp,
			port : parseInt(loginInfo.dbPort) || 3306
		})
	}
}

export default getDbConfigByLoginInfo;
