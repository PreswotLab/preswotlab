export const getCreateTableQuery = async (tableName, result) => {

	const cols = Object.keys(result);
	return (
	`
		CREATE TABLE ${tableName} (

		);
	`);
}
