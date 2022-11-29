import "./env";
import express from 'express';
import morgan from 'morgan';
import { urlencoded } from 'body-parser';
import session from 'express-session';
import { localMiddleware } from './middlewares';

//Common
import rootRouter from "./routers/Common/rootRouter"; 
import uploadRouter from "./routers/Common/uploadRouter";

//A
import domainScanRouter from "./routers/A/domainScanRouter";
import { editTableRouter } from "./routers/A/editTableRouter";
import apiRouter from "./routers/Common/apiRouter";

//B


const app = express();

//server로 어떤 요청 오는지 확인
app.use(morgan("dev"));

//템플릿 엔진 세팅
app.set("view engine", "pug")
app.set("views", [
	process.cwd() + "/src/views/layouts",
	process.cwd() + "/src/views/layouts/domainScan",
	process.cwd() + "/src/views/layouts/editTable"
])

app.use(urlencoded({ extended : true }));

app.use(express.json());

const { COOKIE_SECRET } = process.env;
app.use(
	session({
		secret: COOKIE_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

//세션 정보 로컬 저장 미들웨어, 로그인 정보(ip, port, dbname, username 저장)
app.use(localMiddleware);

//client단에서 사용될 정적파일들
app.use('/static', express.static('assets'));

//Common
app.use("/", rootRouter);
app.use(uploadRouter);
app.use(apiRouter);

//A
app.use(domainScanRouter);
app.use(editTableRouter);

//B
//app.use('/single-join', singleJoinRouter);
//app.use('/multi-join', multiJoinRouter);
//app.use('/result', resultRouter);

//server 4000번 port사용, Listening 핸들러 호출
const PORT = 4000;
app.listen(PORT, () => {
	console.log('test')
});
