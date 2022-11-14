/*
 * Query Result = 
 * [
 *		{Tables_in_dbserver : tablename1},
 *		{Tables_in_dbserver : tablename2},
 *		....
 *		meta : [
 *			...
 *			...
 *		]
 * ];
 * */
const getTableNames = (result) => {
	let tableNames = [];
	let i;

	i = 0;
	while (true)
	{
		if (typeof(result[i]) == 'object')
			tableNames.push(result[i]['Tables_in_dbserver'])
		else
			break;
		i++;
	}
	return (tableNames);
};

export default getTableNames;
