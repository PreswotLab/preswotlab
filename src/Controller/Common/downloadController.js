import {Parser} from "json2csv";
import dbConnectQuery from "../Common/tools/user/dBConnectQuery";

export const downloadCSVFile = async (req, res) => {

    const { title, viewName } = req.params;

    try {
        const selectViewQuery = `
            SELECT
                *
            FROM ${viewName};
        `;

        const result = await dbConnectQuery(req.session.loginInfo, selectViewQuery);

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(result);
        res.setHeader('Content-type', "text/csv");
        res.setHeader('Content-disposition', `attachment; filename=${title}_JOIN.csv`);
        res.send(csv);
    }
    catch (e) {
        console.log(e.message);
        res.redirect('/logout');
    }
}