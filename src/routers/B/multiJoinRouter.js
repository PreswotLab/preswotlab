import express from 'express';

const multiJoinRouter = express.Router();

multiJoinRouter
	.route('/multi-join')
	.all(checkLoginMiddleware)
	.get(getMultiJoin)
	.post(postMultiJoin)

export default multiJoinRouter;
