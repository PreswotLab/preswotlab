import 'dotenv/config';

function getServerDbConfig () {
	const config = {
		user : DBUSER,
		password : DBPASSWORD,
		database : DBNAME,
		host : DBIP,
		port : parseInt(DBPORT)
	}
	return (config);
}

export default getServerDbConfig;
