const getLoginInfoByForm = (body) => {
	return ({
		dbUser : body.dbusername,
		dbName : body.dbname,
		dbHostIp : body.dbhostip,
		dbPort : body.dbport,
		dbKind : body.dbkind,
		dbPassword : body.dbpassword //나중에 암호화해서 저장..
	});
}

export default getLoginInfoByForm;
