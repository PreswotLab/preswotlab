import dbConnectQuery from "../../dbs/userDbConnect";

const whetherTableScanned = async (tableNames) => {
	const result = await dbConnectQuery(loginInfo, 
		`
		SELECT table_name, scan_yn
		FROM tb_scan S, tb_user U
		WHERE U.user_seq = S.user_seq AND
		U.db_type = ${loginInfo.dbKind} AND
		U.host = ${loginInfo.dbHostIp} AND
		U.user_id = ${loginInfo.dbUser} AND
		U.db_name = ${loginInfo.dbName}`);


	return (result)
}

export default whetherTableScanned;
