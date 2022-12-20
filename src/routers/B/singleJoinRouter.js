import express from 'express';
import { getSearchForm, getPossibleResult, getSingleJoin } from '../../Controller/B/singleJoinController';
import {checkLoginMiddleware} from '../../middlewares';

export const singleJoinRouter = express.Router();

singleJoinRouter.get("/single-join", checkLoginMiddleware, getSearchForm);
singleJoinRouter.get("/api/getPossibleResult", checkLoginMiddleware, getPossibleResult)

singleJoinRouter.post("/api/getSingleJoin", checkLoginMiddleware, getSingleJoin)

// singleJoinRouter.post("/api/getSearchResult", checkLoginMiddleware, getSearchResult);

//
// singleJoinRouter
// 	.route('/')
// 	.all(checkLoginMiddleware)
// 	.get(getSingleJoin)
// 	.post(postSingleJoin)
//
// export default singleJoinRouter;
