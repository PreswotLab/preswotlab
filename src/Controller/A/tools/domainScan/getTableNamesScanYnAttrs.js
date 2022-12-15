import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";
import getServerLoginInfo from "../../../Common/tools/user/getServerLoginInfo";
import {concatTableAttrs} from "../common/concatTableAttrs";


/* 
[
{
	table_name : "~",
	attr_name : "~",
	scan_yn : "~",
	row_num : "~"
},
{
	table_name : "~",
	attr_name : "~",
	scan_yn : "~",
	row_num : "~"
},
 ...
]
*/

export const getTableNamesAndScanynAttrs = async (user_seq) => 
{
	const result = await dbConnectQuery(getServerLoginInfo(),
	`
		select sc.table_seq, table_name, attr_name, scan_yn, row_num 
		from tb_scan sc 
		left outer join tb_attribute at 
		on sc.user_seq = ${user_seq}
		and sc.table_seq = at.table_seq;
	`);
	//테이블 별 attr_name을 하나로 합쳐야합니다.
	return (concatTableAttrs(result))
}
