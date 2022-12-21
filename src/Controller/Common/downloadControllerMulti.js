import path from "path";
const { parse } = require('csv-parse');
const fs = require('fs');


export const downloadCSVFileMulti = async (req, res) => {
    const { title, viewName } = req.params;
    let csvData=[];
    const csv_path = path.join(__dirname, '..', 'B', 'multiJoinCSV', `${viewName}.csv`)

    try {
        await fs.createReadStream(csv_path)
            .pipe(parse({delimiter: ','}))
            .on('data', function(csvrow) {
                    csvData.push(csvrow);        
                })
            .on('end',function() {
                const data = csvData.map((row) => row.join(',')).join('\n')
                res.setHeader('Content-type', "text/csv");
                res.setHeader('Content-disposition', `attachment; filename=${title}.csv`);
                res.send('\uFEFF' +  data);
        });
    }
    catch (e) {
        console.log(e.message);
        res.redirect('/logout');
    }
}