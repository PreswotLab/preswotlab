import 'dotenv/config';
const mariadb = require('mariadb');

const serverDbConnectQuery = async (query) => {
	const config = {
		user : DBUSER,
		password : DBPASSWORD,
		database : DBNAME,
		host : DBIP,
		port : parseInt(DBPORT)
	};

	const conn = await mariadb.createConnection(config);
	try {
		const res = await conn.query(query);
		console.log("current user config:", config);
		console.log("get a result in query:", query, "res: ", res);
		return (res);
	} catch (e) {
		console.log(e)
		throw(e);
	} finally {
		conn.end();
	}
}

export default serverDbConnectQuery;
