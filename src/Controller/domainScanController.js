import getTableNames from "./tools/domainScan/getTableNames";
import { ScanResult } from "./tools/domainScan/ScanResult";

export const getDomainScan = async (req, res) => {
	const loginInfo = req.session.loginInfo;
	try {
		let tableNames = await getTableNames(loginInfo);
		res.render('domain-scan', { title : "PRESWOT LAB" , tableNames : tableNames});
	} catch (e) {
		console.log(e);
		res.status(404).redirect('/logout');
	}
};

export const getDomainScanResult = async (req, res) => {
	console.log("routing domain-test")
	const { tableName } = req.params;
	const { loginInfo } = req.session;
	console.log(tableName);
	try {
		let ScanObject = new ScanResult(tableName, loginInfo);
		const result = await ScanObject.getResult();
		console.log("NUMERIC SCAN RESULT : ", result.numericResult, "\n");
		console.log("CATEGORY SCAN RESULT : ", result.categoryResult, "\n");


		res.render("domain-scan-result",  { title : "PRESWOT LAB", result});
	} catch (e) {
		res.status(404).redirect('/logout');
	}
}

export const saveRepresentAttrKey = async (req, res) => {
	res.end();
}
