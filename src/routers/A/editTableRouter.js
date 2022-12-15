import express from 'express';
import { getEditTableHome, getEditTableRows, deleteAttr, modAttr } from '../../Controller/A/editTableController';
import {checkLoginMiddleware} from '../../middlewares';

export const editTableRouter = express.Router();

editTableRouter.get("/edit-table", checkLoginMiddleware, getEditTableHome);
editTableRouter.get("/edit-table/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)/:tableSeq([0-9]+)", checkLoginMiddleware, getEditTableRows);

editTableRouter.delete('/edit-table/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)/:tableSeq([0-9]+)/del', checkLoginMiddleware, deleteAttr);
editTableRouter.put('/edit-table/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)/:tableSeq([0-9]+)/mod', checkLoginMiddleware, modAttr);
