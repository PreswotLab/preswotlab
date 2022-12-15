import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";
import getServerLoginInfo from "../../../Common/tools/user/getServerLoginInfo";
import {concatTableAttrs} from "../common/concatTableAttrs";

export const getTableNamesScanned = async (user_seq) => {
	const result = await dbConnectQuery(getServerLoginInfo(),
	`
		select table_name, attr_name, row_num 
		from tb_scan sc, tb_attribute at 
		WHERE sc.user_seq = ${user_seq}
		and sc.table_seq = at.table_seq
		and sc.scan_yn = 'Y';
	`);
	//attr_name을 하나로 합쳐야합니다.
	return (concatTableAttrs(result));
}
