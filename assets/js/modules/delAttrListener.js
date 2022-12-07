import deleteData from "./deleteData.js";

const delAttrListener = async (e) => {
	console.log((e.target.value));
	try {
		const delAttr = e.target.value;
		const tableName = document.getElementById('tableName').innerHTML;
		const response = await deleteData(`./${tableName}/del`, { delAttr });
		console.log(response);
		if (response.status == 0) //서버에서 트랜젝션 처리 실패시, throw
			throw(Error);
		else //성공
		{
			const delTr = document.getElementById(`tr_${delAttr}`);
			delTr.remove();
		}
	} catch (e) {
		console.log(e.message);
		alert("삭제 실패");
	}
}

export default delAttrListener;
