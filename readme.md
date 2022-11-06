# mssql 연동


## config 파일

```js
const sql = require('mssql')

const fakesqlConfig = {
	user : "sa",//이 4개 문자열은 login form의 것들로 치환되어야한다
	password : "Password.1",//
	database : "leedb",//
	server : "localhost",//
	port : 1433,//port도 default값은 1433
	pool: {
	max: 10,
	min: 0,
	idleTimeoutMillis: 30000
	},
	options: {
	encrypt: true, // for azure
	trustServerCertificate: true // change to true for local dev / self-signed certs
	}
}
```

이렇게 작성된 객체를 사용한다.

<br>


```js
async function connectMssql() {
	 try {
	// make sure that any items are correctly URL encoded in the connection string
	await sql.connect(fakesqlConfig);
	console.log("hi!");
	const result = await sql.query("select * from department");
	console.log(result)
 } catch (err) {
	console.log(err)
  // ... error checks
 }
}
```


<br><br>


## connection pooling


mssql 라이브러리의 특징은 connection pooling을 사용하는건데, 1번 연결된 연결을 끊지않고 재사용한다는 것이다.  
1번 연결 해놓으면 다음번에 sql.connect()함수를 호출하면 `global connection pool`에서 처리한다.  
반복적으로 함수를 호출해도 이미 연결되어있다면, 연결된 pool을 리턴하기때문에 그대로 사용할 수 있다.  


<br>

- 여기서 문제는, 사용자가 사용하는 DB와 서버DB가 동일할때는 connection을 어떻게 유지할 것인가이다.  
-


<br><br>


# mariadb

[npm mariadb](https://www.npmjs.com/package/mariadb)  

- 프로젝트에서 DB서버 구축에 사용될 db.
- 3306번 포트를 기본적으로 사용한다.


[ref](https://emunhi.com/view/201812/02154627862?menuNo=10031)
[DB접속오류해결](https://csksoft.tistory.com/69)

<br><br>

# mysql

[npm mysql](https://www.npmjs.com/package/mysql)
[도커 이용해 Mysql 다운하기](https://poiemaweb.com/docker-mysql)




<br><br>

# 앱 설계

## login

- 로그인 정보는 ip, db이름, port번호, username(dbusername), userpassword(dbuserpassword), 그리고 사용할 DB의 정보로 이루어진다.  

