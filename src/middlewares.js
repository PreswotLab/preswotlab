import multer from "multer";

//middleware를 거친 프로젝트 전체에서 사용가능한 변수만들기 
export const localMiddleware = (req, res, next) => {
	//login 상태정보를 프로젝트 로컬변수로 저장해 pug에서 사용
	res.locals.siteName = "PRESWOT LAB";
	res.locals.loggedIn = Boolean(req.session.loggedIn);
	res.locals.loginInfo = req.session.loginInfo;
	next();
}

export const checkLoginMiddleware = (req, res, next) => {
	if (req.session.loggedIn == true) //로그인 되어있나?
	{
		console.log(req.session.loggedIn);
		next();
	}
	else //로그인 안되어있음
		return res.redirect("/login");
}

export const checkNotLoginMiddleware = (req, res, next) => {
	if (req.session.loggedIn)
		return res.redirect("/")
	else
		next();
}

export const csvUpload = multer({
	dest : "./tmp/"
})
