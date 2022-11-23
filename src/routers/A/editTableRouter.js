import express from 'express';
import { getEditTable, deleteAttr } from '../../Controller/A/editTableController';

export const editTableRouter = express.Router();

editTableRouter
	.route('/')
	.get(getEditTable)

editTableRouter.post('/:tableName/deletion', deleteAttr);
