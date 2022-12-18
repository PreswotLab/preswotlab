import getTableNames from "./getTableNames"
import {getTableNamesAndScanyn} from "./getTableNamesAndScanyn";
import { extractObjects } from "./extractObjects";
import getServerLoginInfo from "../../../Common/tools/user/getServerLoginInfo";
import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";

export const updateUserTables = async(loginInfo) => {
	const userSeq = loginInfo.user_seq;

	//현재 CLIENT DB에 있는 테이블들
	const userTables = await getTableNames(loginInfo);


	//현재 SERVER DB에서 관리되고있는 테이블들
	const serverUserTableSets = new Set(extractObjects(await getTableNamesAndScanyn(userSeq), 'table_name'));
	for (let i = 0; i < userTables.length; i++)
	{
		//server에 존재하는 User의 테이블에 사용자DB의 테이블이 없다면 생성
		if (!serverUserTableSets.has(userTables[i]))
			await dbConnectQuery(getServerLoginInfo(), 
			`
				INSERT INTO tb_scan(
				user_seq, 
				table_name
				) VALUES (
				${userSeq}, 
				'${userTables[i]}'
				);
			`);
	}
}

export const updateUserTables2 = async(loginInfo) => {
	const userSeq = loginInfo.user_seq;

	//현재 CLIENT DB에 있는 테이블들
	const userTables = await getTableNames(loginInfo);

	//현재 SERVER DB에서 관리되고있는 테이블들
	const serverUserTableSets = new Set(extractObjects(await getTableNamesAndScanyn(userSeq), 'table_name'));
	for (let i = 0; i < userTables.length; i++)
	{
		//server에 존재하는 User의 테이블에 사용자DB의 테이블이 없다면 생성
		if (!serverUserTableSets.has(userTables[i]))
			await dbConnectQuery(getServerLoginInfo(), 
			`
				INSERT INTO tb_scan(
				user_seq, 
				table_name
				) VALUES (
				${userSeq}, 
				'${userTables[i]}'
				);
			`);
	}
}
