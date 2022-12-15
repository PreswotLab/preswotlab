import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";
import getServerLoginInfo from "../../../Common/tools/user/getServerLoginInfo";


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
	const rtn = [];
	let cur;
	for (let i = 0; i < result.length; i++)
	{
		cur = result[i];
		//비어있거나, table_name이 다르다면
		if (rtn.length == 0 || rtn[rtn.length - 1]["table_name"] != cur['table_name'])
			rtn.push(result[i]); //push
		else
		{
			//마지막 원소의 attr_name의 뒤에 ,로 구분해 속성명을 이어 붙입니다.
			rtn[rtn.length - 1]['attr_name'] = rtn[rtn.length - 1]['attr_name'].concat(", ", cur['attr_name']);
		}
	}
	return (rtn);
}
