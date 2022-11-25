import express from 'express';
import { checkLoginMiddleware } from '../../middlewares';
import { getDomainScan, getDomainScanResult, saveMappingData } from '../../Controller/A/domainScanController';

const domainScanRouter = express.Router();

domainScanRouter
	.route('/')
	.all(checkLoginMiddleware)
	.get(getDomainScan);

domainScanRouter.get("/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)", checkLoginMiddleware, getDomainScanResult);

domainScanRouter.post("/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)/save", checkLoginMiddleware, saveMappingData)

export default domainScanRouter;
