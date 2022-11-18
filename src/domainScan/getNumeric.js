import dbConnectQuery from "../dbs/dbConnectQuery";

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
	return (result);
};

export default getNumeric;
