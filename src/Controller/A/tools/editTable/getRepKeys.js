import getServerLoginInfo from "../../../Common/tools/user/getServerLoginInfo"
import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";
import {queryByDbConnObj} from "../../../Common/tools/user/queryByConnObj";

export const getRepKeys = async () => {
	const serverLoginInfo = getServerLoginInfo();
	const repKeyResult = await dbConnectQuery(serverLoginInfo,
	`
	SELECT rkey_name
	FROM tb_rep_key;
	`);
	return (repKeyResult);
}

export const getRepKeysByConn = async (serverConn) => {
	const repKeyResult = await queryByDbConnObj(serverConn,
	`
	SELECT rkey_name
	FROM tb_rep_key;
	`);
	return (repKeyResult);
}

