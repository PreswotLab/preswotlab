import {Parser} from "json2csv";
import dbConnectQuery from "../Common/tools/user/dBConnectQuery";
import getServerLoginInfo from "../Common/tools/user/getServerLoginInfo";
import {getTableNamesAndScanynAttrs} from "./tools/domainScan/getTableNamesScanYnAttrs";
import {SaveMapping} from "./tools/domainScan/SaveMappingObj";
import { ScanResult } from "./tools/domainScan/ScanResult";
import { updateUserTables } from "./tools/domainScan/updateUserTables";
import { getBoxplotData } from "./tools/editTable/getBoxplotData";

export const getDomainScan = async (req, res) => {
	const loginInfo = req.session.loginInfo;
	try {
		await updateUserTables(loginInfo);
		const tbNameScanYn = await getTableNamesAndScanynAttrs(loginInfo.user_seq);
		res.render('domain-scan', { tbNameScanYn });
	} catch (e) {
		console.log(e.message);
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
	const { loginInfo } = req.session;

	/*
{
  name: [ 'asdfa', '-' ],
  pnum: [ '-', '-' ],
  gender: [ '-', '-' ],
  id: [ '-', '-' ]
}
*/
	try {
		const saveMap = new SaveMapping(tableName, loginInfo.user_seq);
		await saveMap.init();
		await saveMap.save(req.body);
		res.redirect(`/edit-table`);
	} catch (e) {
		console.log(e.message);
		res.redirect('/logout');
	}
};

export const addRepAttr = async (req, res) => {
	const serverLoginInfo = getServerLoginInfo();
	try {
		const result = await dbConnectQuery(serverLoginInfo, 
			`
				SELECT *
				FROM tb_rep_attribute
				WHERE rattr_name = '${req.body.name}';
			`);
		if (result.length != 0)
			res.json({ status : 0 });
		else
		{
			await dbConnectQuery(serverLoginInfo,
			`
				INSERT INTO tb_rep_attribute(rattr_name)
				VALUES('${req.body.name}');
			`);
			res.json({ status : 1 });
		}
	} catch (e) {
		console.log(e.message);
		res.status(404).redirect('/logout');
	}
}

export const addRepJoinKey = async (req, res) => {
	const serverLoginInfo = getServerLoginInfo();
	try {
		const result = await dbConnectQuery(serverLoginInfo, 
			`
				SELECT *
				FROM tb_rep_key
				WHERE rkey_name = '${req.body.name}';
			`);
		if (result.length != 0)
			res.json({ status : 0 });
		else
		{
			await dbConnectQuery(serverLoginInfo,
			`
				INSERT INTO tb_rep_key(rkey_name)
				VALUES('${req.body.name}');
			`);
			res.json({ status : 1 });
		}
	} catch (e) {
		console.log(e.message);
		res.status(404).redirect('/logout');
	}
}

export const downloadCategory = async(req, res) => {

	try {
	const { tableName } = req.params;
	const { loginInfo } = req.session;

	const result = await dbConnectQuery(getServerLoginInfo(),
	`
	SELECT 
	attr_name,
	d_type as attr_type,
	null_num,
	null_num / s.row_num AS 'null_portion',
	diff_num, 
	special_num,
	special_num / s.row_num AS 'special_portion',
	key_candidate as 'recommended key'
	FROM tb_attribute a, tb_scan s
	WHERE s.table_name = '${tableName}'
	AND s.user_seq = ${loginInfo.user_seq}
	AND a.table_seq = s.table_seq
	AND a.attr_type = 'C';
	`);
	const json2csvParser = new Parser();
	const csv = json2csvParser.parse(result); //string으로 변환
	res.setHeader('Content-type', "text/csv");
	res.setHeader('Content-disposition', `attachment; filename=${tableName}_categoryScan.csv`);
	res.send(csv);
	} catch (e) {
		console.log(e.message);
	}
}

export const downloadNumeric = async (req, res) => {

	try {
	const { tableName } = req.params;
	const { loginInfo } = req.session;

	const result = await dbConnectQuery(getServerLoginInfo(),
	`
	SELECT 
	attr_name,
	d_type as attr_type,
	null_num,
	null_num / s.row_num AS 'null_portion',
	diff_num,
	max_value as 'max',
	min_value as 'min',
	zero_num,
	zero_num / s.row_num AS 'zero_portion',
	key_candidate AS 'recommended key'
	FROM tb_attribute a, tb_scan s
	WHERE s.table_name = '${tableName}'
	AND s.user_seq = ${loginInfo.user_seq}
	AND a.table_seq = s.table_seq
	AND a.attr_type = 'N';
	`);
	const json2csvParser = new Parser();
	const csv = json2csvParser.parse(result); //string으로 변환
	res.setHeader('Content-type', "text/csv");
	res.setHeader('Content-disposition', `attachment; filename=${tableName}_numericScan.csv`);
	res.send(csv);
	} catch (e) {
		console.log(e.message);
	}
}

export const getBoxplotController = async (req, res) => {
	try {
		const { tableName } = req.params;
	// [
	//   {
	// 	x: 'Category A',
	// 	y: [54, 66, 69, 75, 88]
	//   },
	//   {
	// 	x: 'Category B',
	// 	y: [43, 65, 69, 76, 81]
	//   },
	//   {
	// 	x: 'Category C',
	// 	y: [31, 39, 45, 51, 59]
	//   },
	//   {
	// 	x: 'Category D',
	// 	y: [39, 46, 55, 65, 71]
	//   },
	//   {
	// 	x: 'Category E',
	// 	y: [29, 31, 35, 39, 44]
	//   },
	//   {
	// 	x: 'Category F',
	// 	y: [41, 49, 58, 61, 67]
	//   },
	//   {
	// 	x: 'Category G',
	// 	y: [54, 59, 66, 71, 88]
	//   }
	// ]
	//위의 형식으로 데이터를 날려줘야한다.
	const result = await getBoxplotData(req.session.loginInfo, tableName);
		res.json({status : 1, data : result})
	} catch (e) {
		console.log(e.message);
		res.json({status : 0});
	}
}
