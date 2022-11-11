const mariadb = require('mariadb');

export default async function MariaMyLogin(config, query) {
	const conn = await mariadb.createConnection(config);
	console.log(config)
	if (query)
	{
		try {
		const res = await conn.query(query)
		console.log(res);
		return (res);
		} catch(e){
			console.log(e)
			throw(e);
		} finally {
			conn.end();
		}
	}
};
