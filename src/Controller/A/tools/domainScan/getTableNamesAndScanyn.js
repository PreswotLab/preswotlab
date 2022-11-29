import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery"
import getServerLoginInfo from "../../../Common/tools/user/getServerLoginInfo";

export const getTableNamesAndScanyn = async (user_seq) => {
	/*
	 * [{table_name : ..., scan_yn : ...},{},{}]
	 * */
	return (await dbConnectQuery(getServerLoginInfo(), 
		`
			SELECT table_name, scan_yn
			FROM tb_scan
			WHERE user_seq = ${user_seq};
	`));
}
