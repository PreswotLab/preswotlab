export const extractObjects = (queryResult, colName) => {
	let results = [];
	for (let i = 0; i < queryResult.length; i++)
		results.push(queryResult[i][colName]);
	return (results);
}
