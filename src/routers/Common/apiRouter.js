import express from 'express';

const apiRouter = express.Router();


apiRouter.post('/api/addRepAttr', addRepAttr);
apiRouter.post('/api/addRepJoinKey', addRepJoinKey);


export default apiRouter;
