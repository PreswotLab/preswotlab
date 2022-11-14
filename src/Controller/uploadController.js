import getDbConfigBySession from '../dbs/getDbConfigBySession';

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
	console.log('postUpload controller');
	try {
		//연결확인
		const loginInfo = req.session.loginInfo;
		const config = getDbConfigBySession(loginInfo);
		if (loginInfo.dbKind == 'MARIADB' || loginInfo.dbKind == 'MYSQL')
		{
		}
		else
		{
		}
		console.log(req.body);
		console.log(req.file);
		req.session.filePaths.push(req.file.path);
		/*
		 * const tableName = req.file.originalname;
		 * csv-parser 사용
		 * */

	} catch (e) {
		console.log(e);
		return (res.redirect("/logout"));//세션 종료시키려 logout으로 리다이렉트
	}
	return (res.redirect("/"));
}
