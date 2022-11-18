import dbConnectQuery from "../dbs/dbConnectQuery";

const getCategory = async (id, loginInfo) => {
const result = await dbConnectQuery(loginInfo, 
	`
	SHOW COLUMNS from ${id} 
	WHERE TYPE LIKE '%char%' 
	OR TYPE LIKE '%text%' 
	OR TYPE LIKE '%date%' 
	OR TYPE LIKE '%time%'
	OR TYPE LIKE 'binary'
	OR TYPE LIKE 'enum';
	`);
return (result);
};

export default getCategory;
