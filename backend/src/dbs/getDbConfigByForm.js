//db에따라 다른 config 만들어서 리턴
const getMssqlConfig = (body) => {
	console.log('getting mssql config')
	const sqlConfig = {
		user : body.dbusername,//이 4개 문자열은 login form의 것들로 치환되어야한다
		password : body.dbpassword,//
		database : body.dbname,//
		server : body.dbhostip,//
		port : parseInt(body.dbport) || 1433,//port도 default값은 1433
		pool: {
		max: 10,
		min: 0,
		idleTimeoutMillis: 30000
		},
		options: {
		encrypt: true, // for azure
		trustServerCertificate: true // change to true for local dev / self-signed certs
		}
	}
	return (sqlConfig)
}

//저희 다른 DB도 지원하나요...?

const getMariaMyDbConfig = (body) => {
	console.log('getting maria, mysql config')
	const config = {
		user : body.dbusername,
		password : body.dbpassword,
		database : body.dbname,
		host : body.dbhostip,
		port : parseInt(body.dbport) || 3306
	}
	return (config);
}

export const getDbConfigByForm = (body) => {

	const dbkind = body.dbkind;

	if (dbkind == 'MSSQL')
		return (getMssqlConfig(body));
	else
		return (getMariaMyDbConfig(body));
}
