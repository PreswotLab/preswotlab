/*
 * 사용자가 추가하고자하는 속성 매핑을 서버에 저장해야합니다.
 * */

export const addRepAttr = async (req, res) => {
	const { tableName } = req.params;
	console.log(req.body.name);
}

export const addRepJoinKey = async (req, res) => {
	const { tableName } = req.params;
	console.log(req.body.name);
}
