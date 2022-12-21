import express from 'express';
import { downloadCSVFile} from '../../Controller/Common/downloadController';
import { downloadCSVFileMulti} from '../../Controller/Common/downloadControllerMulti';
import {checkLoginMiddleware} from '../../middlewares';

const downloadRouter = express.Router();

downloadRouter.get("/api/download/join/:title([0-9A-Za-zㄱ-ㅎ-_]+)/:viewName([0-9A-Za-zㄱ-ㅎ-_]+)", checkLoginMiddleware, downloadCSVFile);
downloadRouter.get("/api/download/multi-join/:title([0-9A-Za-zㄱ-ㅎ-_]+)/:viewName([0-9A-Za-zㄱ-ㅎ-_]+)", checkLoginMiddleware, downloadCSVFileMulti);

export default downloadRouter;
