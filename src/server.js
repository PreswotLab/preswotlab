import express from 'express';
import morgan from 'morgan';
import rootRouter from './routers/rootRouter';
import flash from 'express-flash'
import "dotenv/config"
import {urlencoded} from 'body-parser';
import session from 'express-session';
const { COOKIE_SECRET } = process.env;
import { checkLoginMiddleware, localMiddleware } from './middlewares';
import uploadRouter from './routers/uploadRouter';
import apiRouter from './routers/apiRouter';

const app = express();

//server로 어떤 요청 오는지 확인
app.use(morgan("dev"));

//템플릿 엔진 세팅
app.set("view engine", "pug")
app.set("views", process.cwd() + "/src/views/layouts")

//formdata middleware
app.use(urlencoded({ extended : true }));

//string middleware
app.use(express.json());

//세션 미들웨어
app.use(
	session({
		secret: COOKIE_SECRET,
		resave: false,
		saveUninitialized: false,
		//store : 쿠키 저장할 서버DB
	})
)

//플래시메시지
app.use(flash());
//세션 정보 로컬 저장 미들웨어, 로그인 정보(ip, port, dbname, username 저장)
app.use(localMiddleware);

//client단에서 사용될 정적파일들
app.use('/static',express.static('assets'));

app.use("/", rootRouter);
app.use(uploadRouter);
//app.use('/domian-scan', domainScanRouter);
//app.use('/edit-table', editTableRouter);
//app.use(singleJoinRouter);
//app.use(multiJoinRouter);
//app.use('/result', resultRouter);

app.use('/api', apiRouter);

//server 3000번 port사용, Listening 핸들러 호출
const PORT = 3000;
app.listen(PORT, () => {
	console.log('test')
});
