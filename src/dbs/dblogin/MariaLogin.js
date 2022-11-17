const mariadb = require('mariadb');

const MariaMyLogin = async (config, query) => {
	const conn = await mariadb.createConnection(config);
	console.log("maria connected");
	if (query)
	{
		try {
			const res = await conn.query(query);
			console.log("current user config:", config);
			console.log("get a result in query:", query, "res: ", res);
			return (res);
		} catch(e){
			console.log(e)
			throw(e);
		} finally {
			conn.end();
		}
	}
};

export default MariaMyLogin;
