import express from 'express';
import { checkLoginMiddleware } from '../../middlewares';
import { 
	getDomainScan, 
	getDomainScanResult2, 
	saveMappingData, 
	addRepAttr, 
	addRepJoinKey, 
	downloadCategory, 
	downloadNumeric, 
	getBoxplotController, 
	downloadDomainFreq
} from '../../Controller/A/domainScanController';
 
const domainScanRouter = express.Router();

domainScanRouter.get("/domain-scan", checkLoginMiddleware, getDomainScan);

//table_seq 도 같이 URL에 받을 수는 없을까?
domainScanRouter.get("/domain-scan/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)/:tableSeq([0-9]+)", checkLoginMiddleware, getDomainScanResult2);

domainScanRouter.post("/api/saveMapping/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)/:tableSeq([0-9]+)", checkLoginMiddleware, saveMappingData)

domainScanRouter.post("/api/addRepAttr", checkLoginMiddleware,addRepAttr);
domainScanRouter.post("/api/addRepJoinKey", checkLoginMiddleware,addRepJoinKey);

domainScanRouter.get("/api/download/category/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)/:tableSeq([0-9]+)", checkLoginMiddleware, downloadCategory);
domainScanRouter.get("/api/download/numeric/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)/:tableSeq([0-9]+)", checkLoginMiddleware, downloadNumeric);

domainScanRouter.get("/api/boxplot/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)/:tableSeq([0-9]+)", checkLoginMiddleware, getBoxplotController);

domainScanRouter.get("/api/download/domain_freq/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)/:attrName([0-9A-Za-zㄱ-ㅎ-_]+)", checkLoginMiddleware, downloadDomainFreq);

export default domainScanRouter;
