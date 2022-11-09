export class DBConnectionBySession
{
	#host;
	#user;
	#name;
	#port;
	#kind;
	#password;

	constructor(sessionLoginInfo)
	{
		this.#host = sessionLoginInfo.dbHostIp;
		this.#user = sessionLoginInfo.dbUser;
		this.#name = sessionLoginInfo.dbName;
		this.#port = sessionLoginInfo.dbPort;
		this.#kind = sessionLoginInfo.dbKind;
	};

	async connect()
	{
		const sql = require('mssql');
		try {
			const conn = await sql.connect(this.#getConfig());
			return (conn);
		} catch (e) {
			throw(e);
		}
	};

	#getConfig() {
		if (this.#kind == 'MSSQL')
			return (this.#getMssqlConfig());
	};

	#getMssqlConfig() {
	return ({
		user : this.#user,
		password : this.#password,
		database : this.#name,
		server : this.#host,
		port : parseInt(this.#port) || 1433,
		pool: {
		max: 10,
		min: 0,
		idleTimeoutMillis: 30000,
		},
		options: {
		encrypt: true, 
		trustServerCertificate: true
		}
	});
	};
};
