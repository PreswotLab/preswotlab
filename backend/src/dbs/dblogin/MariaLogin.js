const maria = require('mariadb');

export default async function MariaMyLogin(config, query) {
	try {
	const conn = await maria.createConnection(config);
		if (query)
		{
			const result = await conn.query(query);
			return (result);
		}
	} catch(e){
		throw(e);
	}
}
