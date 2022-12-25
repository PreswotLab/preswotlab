import getServerLoginInfo from "../../../Common/tools/user/getServerLoginInfo"
import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";
import {queryByDbConnObj} from "../../../Common/tools/user/queryByConnObj";

export const getRepAttrs = async () => {
	const serverLoginInfo = getServerLoginInfo();
	const repAttrResult = await dbConnectQuery(serverLoginInfo,
	`
	SELECT rattr_name
	FROM tb_rep_attribute;
	`);
	return (repAttrResult);
}

export const getRepAttrsByConn = async (serverConn) => {
	const repAttrResult = await queryByDbConnObj(serverConn,
	`
	SELECT rattr_name
	FROM tb_rep_attribute;
	`);
	return (repAttrResult);
}
