import dbConnectQuery from "./tools/user/dBConnectQuery";
import { getCreateTableQuery } from "./tools/upload/getCreateTableQuery";
const fs = require('fs');
const csvParser = require('csv-parser');

export const getUpload = (req, res) => {
	return res.render('upload', {title : 'upload'});
}

/*
 * POST /upload
 * file명의 table을 세션에 연결된 DB에 저장.
 * csv파일의 첫 번째 줄이 column명이 될거고,
 * 두번째 줄의 각 변수를 숫자로 변환할 수 있는지 없는지에따라 
 * */
export const postUpload = async (req, res) => {
	//사용자 DB에 저장함.
	try { 
		 const path = req.file.path; 
		 req.session.filePaths.push(path); 
		 const results = []; 
		 fs.createReadStream(path) 
			 .pipe(csvParser()) 
			 .on('data', (data) => results.push(data)) 
			 .on('end', async () => { 
				 const tableName = req.file.originalname; 
				 const query = await getCreateTableQuery(tableName, results[0]); 
				 await dbConnectQuery(req.session.loginInfo, query); 
			 }); 
	 } catch (e) { 
	     console.log(e); 
	     return (res.redirect("/logout"));//세션 종료시키려 logout으로 리다이렉트 
	 } 
	return (res.redirect("/"));
}
