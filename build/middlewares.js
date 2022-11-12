"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.localMiddleware = exports.csvUpload = exports.checkNotLoginMiddleware = exports.checkLoginMiddleware = void 0;
var _multer = _interopRequireDefault(require("multer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
//middleware를 거친 프로젝트 전체에서 사용가능한 변수만들기 
var localMiddleware = function localMiddleware(req, res, next) {
  //login 상태정보를 프로젝트 로컬변수로 저장해 pug에서 사용
  res.locals.siteName = "PRESWOT LAB";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loginInfo = req.session.loginInfo;
  next();
};
exports.localMiddleware = localMiddleware;
var checkLoginMiddleware = function checkLoginMiddleware(req, res, next) {
  if (req.session.loggedIn)
    //로그인 되어있나?
    next();else
    //로그인 안되어있음
    return res.redirect("/");
};
exports.checkLoginMiddleware = checkLoginMiddleware;
var checkNotLoginMiddleware = function checkNotLoginMiddleware(req, res, next) {
  if (req.session.loggedIn) return res.redirect("/");else next();
};
exports.checkNotLoginMiddleware = checkNotLoginMiddleware;
var csvUpload = (0, _multer["default"])({
  dest: "./tmp/"
});
exports.csvUpload = csvUpload;
//# sourceMappingURL=middlewares.js.map