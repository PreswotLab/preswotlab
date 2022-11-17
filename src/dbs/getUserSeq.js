import getServerLoginInfo from "./getServerLoginInfo";
import dbConnectQuery from "./dbConnectQuery";

const getUserSeq = async (loginInfo) => {
	let user_seq;
	const serverLoginInfo = getServerLoginInfo();
	try {
		const res = await dbConnectQuery(serverLoginInfo, 
			`SELECT user_seq FROM tb_user AS U 
			WHERE U.db_type = "${loginInfo.dbKind}" AND
			U.host = "${loginInfo.dbHostIp}" AND 
			U.user_id = "${loginInfo.dbUser}" AND 
			U.db_name = "${loginInfo.dbName}";`
		);
		if (res.length == 0)
		{
			await dbConnectQuery(serverLoginInfo, `INSERT INTO tb_user(db_type, host, port, user_id, db_name) VALUES ("${loginInfo.dbKind}", "${loginInfo.dbHostIp}", "${loginInfo.dbPort}", "${loginInfo.dbUser}", "${loginInfo.dbName}");`);
			const userID = await dbConnectQuery(serverLoginInfo, `SELECT user_seq FROM tb_user AS U WHERE U.db_type = "${loginInfo.dbKind}" AND U.host = "${loginInfo.dbHostIp}" AND U.user_id = "${loginInfo.dbUser}" AND U.db_name = "${loginInfo.dbName}"`);
			user_seq = userID[0]["user_seq"];
		} else {
			user_seq = res[0]["user_seq"];
		}
		console.log(user_seq)
	} catch (e) {
		console.log(e);
	}
};

export default getUserSeq;
