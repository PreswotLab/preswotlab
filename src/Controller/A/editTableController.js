import {getTableNamesAndScanyn} from "./tools/domainScan/getTableNamesAndScanyn";

export const getEditTableHome = async (req, res) => {
	const tbNameScanYn = await getTableNamesAndScanyn(req.session.loginInfo.user_seq);
	console.log(tbNameScanYn);
	res.render('edit-table', { tbNameScanYn });
}

export const getEditTableRows = async (req, res) => {

}

/*
 * 속성 삭제하는 함수.
 * req.session.loginInfo로 사용자 DB에 쿼리 날려야한다.
 * */
export const deleteAttr = async (req, res) => {

};

export const modAttr = async (req, res) => {

}
