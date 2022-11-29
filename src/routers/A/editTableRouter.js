import express from 'express';
import { getEditTableHome, getEditTableRows, deleteAttr, modAttr } from '../../Controller/A/editTableController';
import {checkLoginMiddleware} from '../../middlewares';

export const editTableRouter = express.Router();

editTableRouter.get("/edit-table", checkLoginMiddleware, getEditTableHome);
editTableRouter.get("/edit-table/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)", checkLoginMiddleware, getEditTableRows);

editTableRouter.post('/edit-table/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)/del', checkLoginMiddleware, deleteAttr);
editTableRouter.post('/edit-table/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)/mod', checkLoginMiddleware, modAttr);
