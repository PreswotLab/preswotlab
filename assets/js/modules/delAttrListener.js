import postData from "./postData.js";

const delAttrListener = async (e) => {
	console.log((e.target.value));
	try {
		const delAttr = e.target.value;
		const tableName = document.getElementById('tableName').innerHTML;
		const response = await postData(`./${tableName}/del`, { delAttr });
		console.log(response);
		if (response.status == 0) //서버에서 트랜젝션 처리 실패시, throw
			throw(Error);
		else //성공
		{
			const delTr = document.getElementsByClassName(`tr_${delAttr}`);
			for (let i = 0; i < delTr.length; i++)
				delTr[i].remove();
		}
	} catch (e) {
		console.log(e.message);
		alert("삭제 실패");
	}
}

export default delAttrListener;
