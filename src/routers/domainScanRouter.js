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

domainScanRouter.get("/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)", checkLoginMiddleware, getDomainScanResult);

domainScanRouter
	.route('/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)/save')
	.all(checkLoginMiddleware)
	.put(saveRepresentAttrKey);

export default domainScanRouter;
