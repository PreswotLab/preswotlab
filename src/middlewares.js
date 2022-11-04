
//middleware를 거친 프로젝트 전체에서 사용가능한 변수만들기 
export const localMiddleware = (req, res, next) => {
	//login 상태정보를 프로젝트 로컬변수로 저장.
	res.locals.loggedIn = Boolean(req.session.loggedIn);
	res.locals.dbUser = req.session.username || {};
	res.locals.dbName = req.session.dbName || {};
	res.locals.dbip = req.session.dbip || {};
	res.locals.dbport = req.session.dbport || {};
	res.locals.dbKind = req.session.dbKind || {};
	next();
}

export const checkLoginMiddleware = (req, res, next) => {
	if (req.session.loggedIn) //로그인 되어있나?
	{
		next();
	}
	else //로그인 안되어있음
	{
		return res.redirect("/");
	}
}

export const checkNotLoginMiddleware = (req, res, next) => {
	if (req.session.loggedIn)
	{
		return res.redirect("/")
	}
	else
	{
		next();
	}
}
