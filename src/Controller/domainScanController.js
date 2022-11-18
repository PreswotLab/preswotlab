import getTableNames from "./tools/getTableNames";
import getNumeric from "../domainScan/getNumeric";
import getCategory from "../domainScan/getCatgory";

export const getDomainScan = async (req, res) => {
	const loginInfo = req.session.loginInfo;
	try {
		let tableNames = await getTableNames(loginInfo);
		console.log(tableNames);
		res.render('domain-scan', { title : "PRESWOT LAB" , tableNames : tableNames});
	} catch (e) {
		console.log(e);
		res.status(404).redirect('/logout');
	}
};

export const getDomainScanResult = async (req, res) => {
	console.log("routing domain-test")
	const { id } = req.params;
	const { loginInfo } = req.session;
	try {
		const numericFields = getNumeric(id, loginInfo);
		const categoryFields = getCategory(id, loginInfo);
		res.render("domain-scan-result",  { title : "PRESWOT LAB" });
	} catch (e) {
		console.log(e);
		res.status(404).redirect('/logout');
	}
}

export const saveRepresentAttrKey = async (req, res) => {
	res.end();
}
