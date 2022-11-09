import { getDbConfig } from "../dbs/getDbConfig";
import userDbConnect from "../dbs/userDbConnect";

//GET /login
export const getLogin = (req, res) => {
	return res.render('login', { title : 'login'})
}

//POST /login
//db connection 필요하므로, async로 정의
export const postLogin = async (req, res) => {
	//dbconnection 만들기 여기서 해야함.

	//config파일 만들어오기
	const dbConfig = getDbConfig(req.body);

	try {
		await userDbConnect(req.body.dbkind, dbConfig);
	} catch (e) {
		console.log(e.message);
		return (res.status(400).render('login', { 
			title : 'login', 
			errorMessage : e.message}))
	}

	console.log('로그인성공!')
	//브라우저측에 세션정보 저장하기
	req.session.loggedIn = true;
	req.session.loginInfo = {
		dbUser : dbConfig.user,
		dbName : dbConfig.database,
		dbHostIp : dbConfig.server || dbConfig.host,
		dbPort : dbConfig.port,
		dbKind : req.body.dbkind,
		dbPassword : req.body.dbpassword //나중에 암호화해서 저장..
	}
	//local middleware에서 local에 저장하게됨
	res.redirect('/');
}

export const getLogout = (req, res) => {
	req.session.destroy();
	return res.redirect("/");
}
