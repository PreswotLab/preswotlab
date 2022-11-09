import { DBConnectionBySession } from "../dbs/DbConnectBySession"; 

export const getUpload = (req, res) => {
	return res.render('upload', {title : 'upload'});
}

export const postUpload = async (req, res) => {
	//사용자 DB에 저장함.
	try {
		let conn = new DBConnectionBySession(req.session.loginInfo);
		conn = await conn.connect();
		//csv 파싱해서 유저 DB에 넣는 로직
		console.log(req.headers);
		console.log(req.body)
		console.log(req.file);
	} catch (e) {
		req.session.destroy();
		return (res.redirect("/"));
	}
	return (res.redirect("/"));
}
