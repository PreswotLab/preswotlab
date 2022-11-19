import dbConnectQuery from "../user/dBConnectQuery";

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

	/*
	 * const rtn = [];
	 * for (let i = 0; i < result.length; i++)
	 * {
	 * 		rtn.push(getCategoryScanObject(result[i]));
	 * }
	 * 
	 * */

return (result);
};

export default getCategory;
