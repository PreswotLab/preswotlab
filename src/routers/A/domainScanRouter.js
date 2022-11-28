import express from 'express';
import { checkLoginMiddleware } from '../../middlewares';
import { getDomainScan, getDomainScanResult, saveMappingData } from '../../Controller/A/domainScanController';
import { addRepAttr, addRepJoinKey } from '../../Controller/A/domainScanController';

const domainScanRouter = express.Router();

domainScanRouter.get("/domain-scan", checkLoginMiddleware, getDomainScan);

domainScanRouter.get("/domain-scan/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)", checkLoginMiddleware, getDomainScanResult);

domainScanRouter.post("/domain-scan/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)/save", checkLoginMiddleware, saveMappingData)

domainScanRouter.post("/api/addRepAttr", addRepAttr);
domainScanRouter.post("/api/addRepJoinKey", addRepJoinKey);


export default domainScanRouter;
