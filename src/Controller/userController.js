import fs from 'fs';
import dbConnectQuery from "../dbs/userDbConnect";
import getLoginInfoByForm from "../dbs/getLoginInfoByForm";

//GET /login
export const getLogin = (req, res) => {
	return res.render('login', { title : 'login'})
}

//POST /login
//db connection 필요하므로, async로 정의
export const postLogin = async (req, res) => {
	//dbconnection 만들기 여기서 해야함.

	//config파일 만들어오기
	const fakeLoginInfo = getLoginInfoByForm(req.body);
	try {
		await dbConnectQuery(fakeLoginInfo, null);
	} catch (e) {
		console.log(e.message);
		return (res.status(400).render('login', { 
			title : 'login', 
			errorMessage : e.message}))
	}

	console.log('로그인성공!')
	//브라우저측에 세션정보 저장하기
	req.session.loggedIn = true;
	req.session.loginInfo = {...fakeLoginInfo};
	req.session.filePaths = [];
	//local middleware에서 local에 저장하게됨
	res.redirect('/');
}

export const getLogout = (req, res) => {
	const filePaths = req.session.filePaths;

	console.log(filePaths)
	filePaths.forEach
	(
		elem => {
			fs.unlinkSync(
					elem,
					function (e)
					{
						console.log(e);
						throw(e)
					}
				)
		}
	);
	req.session.destroy();
	console.log('session destroy');
	return res.redirect("/");
}
