const mariadb = require('mariadb');

export default async function MariaMyLogin(config, query) {
	const conn = await mariadb.createConnection(config);
	if (query)
	{
		try {
			const res = await conn.query(query);
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
