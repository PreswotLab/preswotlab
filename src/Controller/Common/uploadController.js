import {createTable} from "./tools/upload/createTable";
import { insertRows } from "./tools/upload/insertRows";
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
		 const results = []; 
		 fs.createReadStream(path) 
			 .pipe(csvParser()) 
			 .on('data', (data) => results.push(data)) 
			 .on('end', async () => { 
				 const tableName = req.file.originalname.split('.').slice(0, -1).join('.'); 
				 await createTable(req.session.loginInfo, tableName, results[0]);
				 await insertRows(req.session.loginInfo, tableName, results);
			 });
		fs.unlinkSync(path);
	 } catch (e) { 
	     console.log(e.message); 
	     return (res.redirect("/logout"));//세션 종료시키려 logout으로 리다이렉트 
	 } 
	return (res.redirect("/"));
}
