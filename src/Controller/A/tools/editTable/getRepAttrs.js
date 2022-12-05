import getServerLoginInfo from "../../../Common/tools/user/getServerLoginInfo"
import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";

export const getRepAttrs = async () => {
	const serverLoginInfo = getServerLoginInfo();
	const repAttrResult = await dbConnectQuery(serverLoginInfo,
	`
	SELECT rattr_name
	FROM tb_rep_attribute;
	`);
	return (repAttrResult);
}
