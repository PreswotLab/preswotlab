"use strict";

var _express = _interopRequireDefault(require("express"));
var _morgan = _interopRequireDefault(require("morgan"));
var _rootRouter = _interopRequireDefault(require("./routers/rootRouter"));
var _expressFlash = _interopRequireDefault(require("express-flash"));
require("dotenv/config");
var _bodyParser = require("body-parser");
var _expressSession = _interopRequireDefault(require("express-session"));
var _middlewares = require("./middlewares");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var COOKIE_SECRET = process.env.COOKIE_SECRET;
var app = (0, _express["default"])();

//server로 어떤 요청 오는지 확인
app.use((0, _morgan["default"])("dev"));

//템플릿 엔진 세팅
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views/layouts");

//formdata middleware
app.use((0, _bodyParser.urlencoded)({
  extended: true
}));

//string middleware
app.use(_express["default"].json());

//세션 미들웨어
app.use((0, _expressSession["default"])({
  secret: COOKIE_SECRET,
  resave: false,
  saveUninitialized: false
  //store : 쿠키 저장할 서버DB
}));

//플래시메시지
app.use((0, _expressFlash["default"])());
//세션 정보 로컬 저장 미들웨어, 로그인 정보(ip, port, dbname, username 저장)
app.use(_middlewares.localMiddleware);

//client단에서 사용될 정적파일들
//app.use("/assets", express.static())

//root router에서 페이지 이동처리
app.use("/", _rootRouter["default"]);

//server 3000번 port사용, Listening 핸들러 호출
var PORT = 3000;
app.listen(PORT, function () {
  console.log('test');
});
//# sourceMappingURL=server.js.map