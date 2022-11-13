# README

- 상용 RDBMS 사용을 기반, 테이블 정보가 포함된 CSV파일과 RDBMS내 테이블 정보를 읽어 속성별 데이터 분석 및 결합, 그리고 결과를 저장한다.


<img width="602" alt="스크린샷 2022-11-14 04 36 06" src="https://user-images.githubusercontent.com/76278794/201540731-4bbf099f-0a0d-4895-9716-50f3cdb81cea.png">


- 사용자가 사용하는 RDBMS를 어플리케이션 서버에서 접속해 데이터를 가져오고, 처리할 수 있어야한다.

<br><br>


# ERD, 어플리케이션 설계

- [ERD draw.io주소](https://app.diagrams.net/#G1LRr4lm1vPxAzDa0EtKj__dLdfWPjqceY)
- [어플리케이션 설계 FIGMA주소](https://www.figma.com/file/lG1cgOmjEUdG93dtsv0yUN/Preswot-Lab?node-id=0%3A1&t=adcsKAZWNKbubu0x-0)


<br><br>

# 개발환경 세팅

- nodejs : `v14.20.1`
- npm : `6.14.17`
- express : `4.18.2`
- template engine : `pug@3.0.2`

위 파일들 설치 후,  
프로젝트 폴더에서 `npm i`로 설치

## aws mariadb server 생성

- aws 인스턴스 생성

- 보안그룹 설정(인바운드)

- 접속
	- `ssh -i key.pem ubuntu@ec2-35-78-76-16.ap-northeast-1.compute.amazonaws.com`  

[AWS 원격접속 허용](https://programist.tistory.com/entry/MySQL-MariaDB-%EC%99%B8%EB%B6%80-%EC%A0%91%EC%86%8D-%ED%97%88%EC%9A%A9-%EB%B0%A9%EB%B2%95)


## mssql 연동

### config 파일

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


### connection pooling


- mssql 라이브러리의 특징은 connection pooling을 사용하는건데, 1번 연결된 연결을 끊지않고 재사용한다는 것이다.  
- 1번 연결 해놓으면 다음번에 sql.connect()함수를 호출하면 `global connection pool`에서 처리한다.  
- 반복적으로 함수를 호출해도 이미 연결되어있다면, 연결된 pool을 리턴하기때문에 그대로 사용할 수 있다.  
- DB서버의 백엔드를 MARIADB로 구축하기때문에 사용자가 많다면 커넥션풀링을 사용해도 될 것 같으나, 이는 추후에...


<br><br>


## mariadb

[npm mariadb](https://www.npmjs.com/package/mariadb)  

- 프로젝트에서 DB서버 구축에 사용될 db.
- 3306번 포트를 기본적으로 사용한다.


[ref](https://emunhi.com/view/201812/02154627862?menuNo=10031)
[DB접속오류해결](https://csksoft.tistory.com/69)

<br><br>

## mysql

[npm mysql](https://www.npmjs.com/package/mysql)
[도커 이용해 Mysql 다운하기](https://poiemaweb.com/docker-mysql)

<br>

## pug

- 6명의 팀원이 있으나 프론트엔드 프레임워크를 주로 사용해본 사람이 없다
- 본인도 공부해본적은 있으나 백엔드에 집중하고 싶다.
- UI적인 요소가 중요하지 않고, 기능적으로 구현해야하는 파트가 많다.

위의 이유로 템플릿 엔진 그대로 프로젝트 끝까지 가지고가려한다.  
나중에 필요하다면 프론트엔드를 따로 만들수도 있을 것 같다.  


## multer

[multer](https://github.com/expressjs/multer/blob/master/doc/README-ko.md)  

## body-parser


## dotenv

## express-session

## morgan

## multer


<br><br>

# Dev 세팅

## nodemon

## babel

## babel/cli

## babel/core

## babel/node

## babel/preset-env

<br><br>

# 앱 설계

## login

- 로그인 정보는 ip, db이름, port번호, username(dbusername), userpassword(dbuserpassword), 그리고 사용할 DB의 정보로 이루어진다.  

