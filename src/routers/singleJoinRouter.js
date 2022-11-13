import express from 'express';

const singleJoinRouter = express.Router();

singleJoinRouter
	.route('/single-join')
	.all(checkLoginMiddleware)
	.get(getSingleJoin)
	.post(postSingleJoin)

export default singleJoinRouter;
