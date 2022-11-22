import express from 'express';

const resultRouter = express.Router();

resultRouter
	.all(checkLoginMiddleware)
	.get(getResultHome);

resultRouter
	.route('/scanned/:id[0-9]')
	.all(checkLoginMiddleware)
	.get(getScannedResult);

resultRouter
	.route('/single/:id[0-9]')
	.all(checkLoginMiddleware)
	.get(getSingleResult);

resultRouter
	.route('/multi/:id[0-9]')
	.all(checkLoginMiddleware)
	.get(getMultiResult);

export default resultRouter;
