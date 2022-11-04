/*
 * sqlconfig from user input
 * */
const sql = require('mssql');

export default async function MssqlLogin(config) {
	// make sure that any items are correctly URL encoded in the connection string
	try {
		await sql.connect(config);
		console.log("hi!");
	} catch (e) {
		throw(e);
	}
}
