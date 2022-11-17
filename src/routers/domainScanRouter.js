import express from 'express';
import {checkLoginMiddleware} from '../middlewares';
import {
	getDomainScan,
	getDomainScanResult,
	saveRepresentAttrKey
	} from '../Controller/domainScanController';

const domainScanRouter = express.Router();

domainScanRouter
	.route('/')
	.all(checkLoginMiddleware)
	.get(getDomainScan);

domainScanRouter
	.route('/:tableName[A-Za-zㄱ-ㅎ]')
	.all(checkLoginMiddleware)
	.get(getDomainScanResult);

domainScanRouter
	.route('/:tableName[A-Za-zㄱ-ㅎ]/save')
	.all(checkLoginMiddleware)
	.put(saveRepresentAttrKey);

export default domainScanRouter;
