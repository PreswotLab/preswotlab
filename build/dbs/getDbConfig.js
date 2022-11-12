"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDbConfig = void 0;
//db에따라 다른 config 만들어서 리턴
var getMssqlConfig = function getMssqlConfig(body) {
  var sqlConfig = {
    user: body.dbusername,
    //이 4개 문자열은 login form의 것들로 치환되어야한다
    password: body.dbpassword,
    //
    database: body.dbname,
    //
    server: body.dbhostip,
    //
    port: parseInt(body.dbport) || 1433,
    //port도 default값은 1433
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: true,
      // for azure
      trustServerCertificate: true // change to true for local dev / self-signed certs
    }
  };

  return sqlConfig;
};

//저희 다른 DB도 지원하나요...?
var getMysqlConfig = function getMysqlConfig(body) {};
var getMariadbConfig = function getMariadbConfig(body) {
  var config = {
    host: body.dbhostip,
    user: body.dbusername,
    password: body.dbpassword,
    database: body.dbname,
    port: parseInt(body.dbport) || 3306
  };
  return config;
};
var getDbConfig = function getDbConfig(body) {
  var dbkind = body.dbkind;
  if (dbkind == 'MSSQL') return getMssqlConfig(body);else if (dbkind == 'MARIADB') return getMariadbConfig(body);
};
exports.getDbConfig = getDbConfig;
//# sourceMappingURL=getDbConfig.js.map