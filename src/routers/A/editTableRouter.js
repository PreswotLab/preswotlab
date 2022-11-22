import express from 'express';

const editTableRouter = express.Router();

editTableRouter
	.route('/edit-table')
	.get(getEditTable)
	.post(postEditTable);

editTableRouter
	.route('/:id/deletion')
	.get(getDeleteCol)
	.post(postDeleteCol);

editTableRouter
	.route('/:id/modify')
	.get(getModifyCol)
	.post(postModifyCol);

editTableRouter
	.route('/:id/mapping')
	.get(getMappingCol)
	.post(postMappingCol);
