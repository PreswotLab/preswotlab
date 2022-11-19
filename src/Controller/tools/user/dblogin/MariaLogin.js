const mariadb = require('mariadb');

const MariaMyLogin = async (config, query) => {
	const conn = await mariadb.createConnection(config);
	if (query)
	{
		try {
			const res = await conn.query(query);
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
