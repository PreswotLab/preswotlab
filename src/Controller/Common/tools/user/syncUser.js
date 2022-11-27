import getServerLoginInfo from "./getServerLoginInfo";
import dbConnectQuery from "./dbConnectQuery";
import getTableNames from "../../../A/tools/domainScan/getTableNames";

/*
 * user가 서버 DB에 있다면 ->
 * 	userSeq 반환
 * 없다면
 * 	userSeq생성, tb_scan동기화
 * */

export class syncUser
{
	#loginInfo;
	#serverLoginInfo;
	#userSeq

	constructor(loginInfo)
	{
		this.#loginInfo = loginInfo;
		this.#serverLoginInfo = getServerLoginInfo();
	};

	getUserSeq()
	{
		return (this.#userSeq);
	};

	async sync()
	{
		await this.#syncUser();
	};


	async #syncUser()
	{
		const res = await dbConnectQuery(this.#serverLoginInfo, 
		`SELECT user_seq FROM tb_user AS U 
		WHERE U.db_type = "${this.#loginInfo.dbKind}" AND
		U.host = "${this.#loginInfo.dbHostIp}" AND 
		U.user_id = "${this.#loginInfo.dbUser}" AND 
		U.db_name = "${this.#loginInfo.dbName}";`
		);
		if (res.length == 0) //not exists
		{
			await this.#insertNewUser();
			await this.#syncTable();
		}
		else //exists
		{
			this.#userSeq = res[0]["user_seq"];
		};
	};

	async #insertNewUser()
	{
		await dbConnectQuery(this.#serverLoginInfo, 
			`INSERT INTO tb_user(
				db_type, 
				host, 
				port, 
				user_id, 
				db_name) VALUES (
				"${this.#loginInfo.dbKind}", 
				"${this.#loginInfo.dbHostIp}", 
				"${this.#loginInfo.dbPort}", 
				"${this.#loginInfo.dbUser}", 
				"${this.#loginInfo.dbName}");
			`);
		const userID = await dbConnectQuery(this.#serverLoginInfo, 
			`
			SELECT user_seq 
			FROM tb_user AS U 
			WHERE U.db_type = "${this.#loginInfo.dbKind}" 
			AND U.host = "${this.#loginInfo.dbHostIp}" 
			AND U.user_id = "${this.#loginInfo.dbUser}" 
			AND U.db_name = "${this.#loginInfo.dbName}"`);
		this.#userSeq = userID[0]["user_seq"];
	};

	async #syncTable()
	{
		const tableNames = await getTableNames(this.#loginInfo);
		for (let i = 0; i < tableNames.length; i++)
		{
			await dbConnectQuery(this.#serverLoginInfo, 
			`
				INSERT INTO tb_scan(user_seq, table_name)
				VALUES (${this.#userSeq}, '${tableNames[i]}');
			`);
		}
	};
};
