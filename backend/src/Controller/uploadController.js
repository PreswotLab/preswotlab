import fs from 'fs';
import csv from 'fast-csv'

export const getUpload = (req, res) => {
	return res.render('upload', {title : 'upload'});
}

export const postUpload = async (req, res) => {
	//사용자 DB에 저장함.
	try {
		//연결확인
		const loginInfo = req.session.loginInfo;
		if (loginInfo.dbKind == 'MARIADB' || loginInfo.dbKind == 'MYSQL')
		{}
		else
		{}
		//
		console.log(req.body);
		console.log(req.file);
		req.session.filePaths.push(req.file.path);
		/*
		 * const tableName = req.file.originalname;
		 *
		 * */

	} catch (e) {
		console.log(e);
		return (res.redirect("/logout"));
	}
	return (res.redirect("/"));
}
