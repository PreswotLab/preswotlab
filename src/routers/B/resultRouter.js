import express from 'express';
import { getResult, getScanResult, getSingleResult, getMultiResult, getScanDetail } from '../../Controller/B/resultContoller';
import {checkLoginMiddleware} from '../../middlewares';
import {getMultiJoinResult} from "../../Controller/B/multiJoinController";

const resultRouter = express.Router();

resultRouter.get("/result", checkLoginMiddleware, getResult);

resultRouter.get("/result/scan", checkLoginMiddleware, getScanResult);
resultRouter.get("/result/scan/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)/:tableSeq([0-9]+)", checkLoginMiddleware, getScanDetail);
resultRouter.get("/result/single", checkLoginMiddleware, getSingleResult);
resultRouter.get("/result/multi", checkLoginMiddleware, getMultiResult);

export default resultRouter;
