import stringParser from "./stringParser";

function getCreateTableQuery(tableName, results) {

	const colNames = Object.keys(results[0]);
	console.log("colNames:",colNames);
	console.log("results:", results);
	
	let attrs = [];


	for (let i = 0; i < colNames.length; i++)
	{
		console.log(stringParser(results[0][colNames[i]]));
		attrs.push(stringParser(results[0][colNames[i]]));
	}
	
	console.log("attrs:", attrs);
	let query = "";

	query.concat('', `CREATE TABLE ${tableName} (`);
	colNames.map(
		(key, i) => {
			//칼럼이름 속성
			query.concat(' ', `${key} ${attrs[i]}, `);
		}
	);
	query.slice(-2, -1);
	query.concat(');');
	console.log("파싱된 쿼리");
	console.log(query);
	return (query);
}

export default getCreateTableQuery;
