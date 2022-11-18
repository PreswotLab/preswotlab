const {
	DBIP,
	DBPORT,
	DBUSER,
	DBNAME,
	DBPASSWORD,
	DBTYPE
} = process.env;

const getServerLoginInfo = () => {
	const config = {
		dbUser : DBUSER,
		dbName : DBNAME,
		dbHostIp : DBIP,
		dbPort : DBPORT,
		dbKind : DBTYPE,
		dbPassword : DBPASSWORD,
	};
	return (config)
}

export default getServerLoginInfo;
