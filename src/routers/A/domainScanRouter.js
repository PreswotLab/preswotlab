import express from 'express';
import { checkLoginMiddleware } from '../../middlewares';
import { getDomainScan, getDomainScanResult, saveMappingData, addRepAttr, addRepJoinKey, downloadCategory, downloadNumeric } from '../../Controller/A/domainScanController';

const domainScanRouter = express.Router();

domainScanRouter.get("/domain-scan", checkLoginMiddleware, getDomainScan);

domainScanRouter.get("/domain-scan/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)", checkLoginMiddleware, getDomainScanResult);

domainScanRouter.post("/domain-scan/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)/save", checkLoginMiddleware, saveMappingData)

domainScanRouter.post("/api/addRepAttr", checkLoginMiddleware,addRepAttr);
domainScanRouter.post("/api/addRepJoinKey", checkLoginMiddleware,addRepJoinKey);

domainScanRouter.get("/api/download/category/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)", checkLoginMiddleware,downloadCategory);
domainScanRouter.get("/api/download/numeric/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)", checkLoginMiddleware,downloadNumeric);

export default domainScanRouter;
