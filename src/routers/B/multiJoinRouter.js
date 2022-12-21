import express from 'express';
import { getMultiSearchForm, getMultiPossibleResult, getMultiJoin } from '../../Controller/B/multiJoinController';
import {checkLoginMiddleware} from '../../middlewares';

export const multiJoinRouter = express.Router();

multiJoinRouter.get("/multi-join", checkLoginMiddleware, getMultiSearchForm);
// multiJoinRouter.get("/multi-join-result", checkLoginMiddleware, getMultiJoinResult);
multiJoinRouter.get("/api/getMultiPossibleResult", checkLoginMiddleware, getMultiPossibleResult)
multiJoinRouter.post("/api/getMultiJoin", checkLoginMiddleware, getMultiJoin)
