/*
 * sqlconfig from user input
 * */
const sql = require('mssql');

export default async function MssqlLogin(config, query) {
	// make sure that any items are correctly URL encoded in the connection string
	try {
		const conn = await sql.connect(config);
		if (query)
		{
			const result = await conn.query(query);
			return (result);
		}
	} catch (e) {
		throw(e);
	}
}
