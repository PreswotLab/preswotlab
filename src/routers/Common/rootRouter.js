import express from 'express';
import { getLogin, postLogin, getLogout } from '../../Controller/Common/userController';
import { checkLoginMiddleware, checkNotLoginMiddleware } from '../../middlewares';

const rootRouter = express.Router();

//application이 /로 들어오는 요청에 대해 콜백함수들을 사용하게된다.
//이 콜백함수들을 모두 middleware라고 부르며, 중간에 있는 미들웨어는 next()로 제어권을 다음 미들웨어로 위임.
const handleHome = (req, res) => {
	console.log('routing home');
	res.render('home', { title : "PRESWOT LAB"});
}

rootRouter
	.get("/", handleHome); //GET /

//login
rootRouter
	.route("/login")
	.all(checkNotLoginMiddleware)
	.get(getLogin) //GET /login
	.post(postLogin); //Post /login login page에서 DB연결 및 Form전송

//logout
rootRouter
	.route('/logout')
	.all(checkLoginMiddleware)
	.get(getLogout);

export default rootRouter;
