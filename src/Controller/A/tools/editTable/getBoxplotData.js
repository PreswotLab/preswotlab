import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";
import getServerLoginInfo from "../../../Common/tools/user/getServerLoginInfo";
import {extractObjects} from "../domainScan/extractObjects";


const getAttrDatas = async(attrName, loginInfo, tableName) => {
	const result = await dbConnectQuery(loginInfo,
	`
		SELECT ${attrName} FROM ${tableName};
	`);
	return(extractObjects(result, `${attrName}`));
}

export const getBoxplotData = async (loginInfo, tableName) => {
	const user_seq = loginInfo.user_seq;
	const result = [];
	//스캔된 테이블에서 수치 속성들의 이름 가져오기
	const attrNamesObject = await dbConnectQuery(getServerLoginInfo(),
	`
		SELECT attr_name
		FROM tb_attribute at, tb_scan sc
		WHERE sc.user_seq = ${user_seq}
		AND sc.table_name = '${tableName}'
		AND at.table_seq = sc.table_seq
		AND at.attr_type = 'N';
	`);
	let obj = {};
	let attrName;

	for (let i = 0; i < attrNamesObject.length; i++)
	{
		attrName = attrNamesObject[i]['attr_name'];
		obj['x'] = attrName;
		obj['y'] = await getAttrDatas(attrName, loginInfo, tableName);
		result.push({ ...obj });
	}
	return (result);
}
