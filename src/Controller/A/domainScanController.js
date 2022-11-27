import getTableNames from "./tools/domainScan/getTableNames";
import { ScanResult } from "./tools/domainScan/ScanResult";

export const getDomainScan = async (req, res) => {
	const loginInfo = req.session.loginInfo;
	try {
		const tableNames = await getTableNames(loginInfo);
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
				numericResult : result.numericResult,
				categoryResult : result.categoryResult,
				repAttrJoinKey : result.repAttrJoinKey,
				tableName
			});
	} catch (e) {
		res.status(404).redirect('/logout');
	}
}

export const saveMappingData = async (req, res) => {
	const { tableName } = req.params;

};
