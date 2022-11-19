import dbConnectQuery from "../user/dBConnectQuery";

const getNumeric = async (id, loginInfo) => {
	const result = await dbConnectQuery(loginInfo, 
		`
		SHOW COLUMNS from ${id} 
		WHERE TYPE LIKE '%int%' 
		OR TYPE LIKE 'double%' 
		OR TYPE LIKE 'float%'
		OR TYPE LIKE 'boolean'
		OR TYPE LIKE 'bit'
		OR TYPE LIKE 'decimal';
		`);

	console.log(result);
	/*
	 * const rtn = [];
	 * for (let i = 0; i < result.length; i++)
	 * {
	 * 		rtn.push(getNumericScanObject(result[i]));
	 * }
	 * 
	 * */
	return (result);
};

export default getNumeric;
