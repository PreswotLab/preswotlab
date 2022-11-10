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

	async dbConnect()
	{
		if (this.#kind == 'MSSQL') {
			try {
				const sql = require('mssql');
				let pool = await sql.connect(this.#getConfig());
				return (pool);
			} catch (e) {
				throw(e);
			}
		} else 
		{
			try {
				const sql = require('mariadb');
				const pool = sql.createPool(this.#getConfig());
				let conn = pool.getConnection();
				return (conn);
			} catch (e) {
				throw(e);
			}
		}
	};

	#getConfig() {
		if (this.#kind == 'MSSQL')
			return (this.#getMssqlConfig());
		else if (this.#kind == 'MARIADB')
			return (this.#getMariaMyConfig());
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

	#getMariaMyConfig() {
		return ({
			user : this.#user,
			password : this.#password,
			database : this.#name,
			host : this.#host,
			port : this.#port
		});
	};
};
