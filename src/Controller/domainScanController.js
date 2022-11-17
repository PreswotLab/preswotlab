import getDbConfigBySession from "../dbs/getDbConfigBySession";
import dbConnectQuery from "../dbs/userDbConnect";
import getTableNames from "./tools/getTableNames";

export const getDomainScan = async (req, res) => {
	const loginInfo = req.session.loginInfo;
	const config = getDbConfigBySession(loginInfo);
	try {
		const result = await dbConnectQuery(loginInfo.dbKind, config, 'SHOW tables;');
		const tableNames = getTableNames(result);
		console.log(tableNames);
		res.render('domain-scan', { title : "PRESWOT LAB" , tableNames : tableNames});
	} catch (e) {
		res.status(404).redirect('/logout');
	}
};

export const getDomainScanResult = async (req, res) => {
	res.end();
}

export const saveRepresentAttrKey = async (req, res) => {
	res.end();
}
