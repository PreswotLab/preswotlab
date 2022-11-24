import express from 'express';
import { getEditTable, deleteAttr } from '../../Controller/A/editTableController';

export const editTableRouter = express.Router();

editTableRouter
	.route('/')
	.get(getEditTable)

editTableRouter.post('/:tableName([0-9A-Za-zㄱ-ㅎ-_]+)/deletion', deleteAttr);
