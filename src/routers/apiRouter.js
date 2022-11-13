import express from 'express';
import {getMulti, getScanned, getSingle} from '../api/download';
import { addRepresentAttr, addRepresentKey } from '../api/addRepresent';
import {checkLoginMiddleware} from '../middlewares';

const apiRouter = express.Router();

/*
파일 다운로드 설계
https://www.zerocho.com/category/NodeJS/post/60778f07cf47fe0004727b12
*/

apiRouter
	.all(checkLoginMiddleware)
	.route('/download/scanned/:id')
	.get(getScanned)

apiRouter
	.all(checkLoginMiddleware)
	.route('/download/single/:id')
	.get(getSingle)

apiRouter
	.all(checkLoginMiddleware)
	.route('/download/multi/:id')
	.get(getMulti);

apiRouter
	.all(checkLoginMiddleware)
	.route('/dictionary/addrepreattr/:[ㄱ-ㅎ]')
	.post(addRepresentAttr);

apiRouter
	.all(checkLoginMiddleware)
	.route('/dictionary/addreprekey/:[ㄱ-ㅎ]')
	.post(addRepresentKey);

export default apiRouter;
