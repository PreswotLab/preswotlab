import express from 'express';
import {checkLoginMiddleware} from '../middlewares';

const domainScanRouter = express.Router();

domainScanRouter
	.route('/')
	.all(checkLoginMiddleware)
	.get(getDomainScan)

domainScanRouter
	.route('/:tableId[0-9]')
	.all(checkLoginMiddleware)
	.get(getDomainScanResult)

domainScanRouter
	.route('/:tableId[0-9]/save')
	.all(checkLoginMiddleware)
	.put(saveRepresentAttrKey);

export default domainScanRouter;
