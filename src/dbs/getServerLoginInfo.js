const {
	DBIP,
	DBPORT,
	DBUSER,
	DBNAME,
	DBPASSWORD,
	DBTYPE
} = process.env;

const getServerLoginInfo = () => {
	console.log("=-============================")
	console.log("DBNAME ::", process.env.DBNAME);
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
