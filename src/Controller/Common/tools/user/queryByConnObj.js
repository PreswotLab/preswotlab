export const queryByDbConnObj = async (conn, query) => {
	const res = await conn.query(query);
	return (res);
}
