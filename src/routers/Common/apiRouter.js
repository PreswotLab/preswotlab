import express from 'express';
import { addRepAttr, addRepJoinKey } from '../../Controller/Common/apiController';

const apiRouter = express.Router();


apiRouter.post('/api/addRepAttr', addRepAttr);
apiRouter.post('/api/addRepJoinKey', addRepJoinKey);


export default apiRouter;
