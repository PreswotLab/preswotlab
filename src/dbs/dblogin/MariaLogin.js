const maria = require('mariadb');

export default async function MariaLogin(config, query) {
	try {
	const conn = await maria.createConnection({
		host : config.server,
		user : config.user,
		password : config.password,
		port : config.port
	})
		if (query)
		{
			const result = await conn.query(query);
			return (result);
		}
	} catch(e){
		throw(e);
	}
}
