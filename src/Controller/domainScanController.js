import getTableNames from "./tools/getTableNames";

export const getDomainScan = async (req, res) => {
	const loginInfo = req.session.loginInfo;
	try {
		let tableNames = await getTableNames(loginInfo);
		console.log(tableNames);
		//let scanWhether = await whetherTableScanned(loginInfo);
		res.render('domain-scan', { title : "PRESWOT LAB" , tableNames : tableNames});
	} catch (e) {
		console.log(e);
		res.status(404).redirect('/logout');
	}
};

export const getDomainScanResult = async (req, res) => {
	console.log("routing domain-test")
	console.log(req.params);
	res.render("domain-scan-result",  { title : "PRESWOT LAB" });
}

export const saveRepresentAttrKey = async (req, res) => {
	res.end();
}
