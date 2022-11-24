import express from 'express';
import { checkLoginMiddleware } from '../../middlewares';
import { getDomainScan, getDomainScanResult, addRepAttr, addRepJoinKey, saveRepresentAttrKey } from '../../Controller/A/domainScanController';

const domainScanRouter = express.Router();

domainScanRouter
	.route('/')
	.all(checkLoginMiddleware)
	.get(getDomainScan);

domainScanRouter.get("/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)", checkLoginMiddleware, getDomainScanResult);

domainScanRouter.post("/addRepAttr", addRepAttr);
domainScanRouter.post("/addRepJoinKey", addRepJoinKey);

export default domainScanRouter;
