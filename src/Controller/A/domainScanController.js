import dbConnectQuery from "../Common/tools/user/dBConnectQuery";
import getServerLoginInfo from "../Common/tools/user/getServerLoginInfo";
import getTableNames from "./tools/domainScan/getTableNames";
import { ScanResult } from "./tools/domainScan/ScanResult";

export const getDomainScan = async (req, res) => {
	const loginInfo = req.session.loginInfo;
	try {
		const tableNames = await getTableNames(loginInfo);
		/*
		 * 현재는 모든 table을 사용자 DB에서 가져오는데,
		 * 사용자 테이블의 스캔여부를 서버에서 관리하는게 보장되므로
		 * 	- 첫 로그인 시에 tb_scan이 모두 만들어지기때문에
		 * tb_scan에서 테이블 이름, 스캔여부 가져오는 방법도 괜찮을듯
		 * */
		res.render('domain-scan', { title : "PRESWOT LAB" , tableNames : tableNames});
	} catch (e) {
		console.log(e);
		res.status(404).redirect('/logout');
	}
};

export const getDomainScanResult = async (req, res) => {
	const { tableName } = req.params;
	const { loginInfo } = req.session;
	try {
		let ScanObject = new ScanResult(tableName, loginInfo);
		const result = await ScanObject.getResult();
		await ScanObject.saveResult();
// NUMERIC SCAN RESULT :  [
//   {
//     attrName: 'age',
//     attrType: 'int(11)',
//     numOfNullRecords: 1,
//     portionOfNullRecords: 0.25,
//     numOfDistinct: 4,
//     recommended: 'y',
//     min: 52,
//     max: 21,
//     numOfZero: 0,
//     portionOfZero: 0
//   },
//   {
//     attrName: 'salary',
//     attrType: 'int(11)',
//     numOfNullRecords: 0,
//     portionOfNullRecords: 0,
//     numOfDistinct: 4,
//     recommended: 'y',
//     min: 2000,
//     max: 100,
//     numOfZero: 0,
//     portionOfZero: 0
//   }
// ]

// CATEGORY SCAN RESULT :  [
//   {
//     attrName: 'c_num',
//     attrType: 'varchar(20)',
//     numOfNullRecords: 0,
//     portionOfNullRecords: 0,
//     numOfDistinct: 4,
//     recommended: 'y',
//     numOfSpcRecords: 0,
//     portionOfSpcRecords: 0
//   },
//   {
//     attrName: 'c_name',
//     attrType: 'varchar(50)',
//     numOfNullRecords: 0,
//     portionOfNullRecords: 0,
//     numOfDistinct: 4,
//     recommended: 'y',
//     numOfSpcRecords: 0,
//     portionOfSpcRecords: 0
//   }
// ]

// rep Attr & Join Key :  {
//   repAttrArray: [ 'finantial_info', 'health_info', 'study_info', 'user_info' ],
//   repKeyArray: [ 'car_number', 'email', 'IP', 'phone_number', 'ssn' ]
// }
		console.log("category : ", result.categoryResult);
		console.log("numeric : ", result.numericResult);
		console.log("rep key attr : ", result.repAttrJoinKey);
		res.render("domain-scan-result",  
			{
				title : "PRESWOT LAB",
				...result,
				tableName
			});
	} catch (e) {
		console.log(e.message);
		res.status(404).redirect('/logout');
	}
		}



export const saveMappingData = async (req, res) => {
	const { tableName } = req.params;
	console.log(tableName);
	console.log(req.body);
};

/*
 * 사용자가 추가하고자하는 속성을 서버에 저장해야합니다.
 * */
export const addRepAttr = async (req, res) => {
	console.log("사용자 입력: ", req.body.name);
	const serverLoginInfo = getServerLoginInfo();
	try {
		const result = await dbConnectQuery(serverLoginInfo, 
			`
				SELECT *
				FROM tb_rep_attribute
				WHERE rattr_name = '${req.body.name}';
			`);
		if (result.length != 0)
			res.send({ status : 0 });
		else
		{
			await dbConnectQuery(serverLoginInfo,
			`
				INSERT INTO tb_rep_attribute(rattr_name)
				VALUES('${req.body.name}');
			`);
			res.send({ status : 1 });
		}
	} catch (e) {
		console.log(e.message);
		res.status(404).redirect('/logout');
	}
}

export const addRepJoinKey = async (req, res) => {
	console.log("사용자 입력:",req.body.name);
	const serverLoginInfo = getServerLoginInfo();
	try {
		const result = await dbConnectQuery(serverLoginInfo, 
			`
				SELECT *
				FROM tb_rep_key
				WHERE rkey_name = '${req.body.name}';
			`);
		if (result.length != 0)
			res.send({ status : 0 });
		else
		{
			await dbConnectQuery(serverLoginInfo,
			`
				INSERT INTO tb_rep_key(rkey_name)
				VALUES('${req.body.name}');
			`);
			res.send({ status : 1 });
		}
	} catch (e) {
		console.log(e.message);
		res.status(404).redirect('/logout');
	}
}
