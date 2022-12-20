import getServerLoginInfo from "../../Common/tools/user/getServerLoginInfo"
import dbConnectQuery from "../../Common/tools/user/dBConnectQuery";

export const getRepKeys = async () => {
	const serverLoginInfo = getServerLoginInfo();
	const repKeyResult = await dbConnectQuery(serverLoginInfo,
	`
	SELECT rkey_seq,
	       rkey_name
	FROM tb_rep_key;
	`);
	return (repKeyResult);
}
