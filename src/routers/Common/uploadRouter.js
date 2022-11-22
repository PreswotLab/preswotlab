import express from 'express'
import { getUpload, postUpload } from '../../Controller/Common/uploadController';
import { checkLoginMiddleware, csvUpload } from '../../middlewares';

const uploadRouter = express.Router();

uploadRouter
	.route('/upload')
	.all(checkLoginMiddleware)
	.get(getUpload)
	.post(csvUpload.single('csv_file'), postUpload);

export default uploadRouter;
