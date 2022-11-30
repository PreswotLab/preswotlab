import postData from "./postData.js";

const delAttrListener = async (e) => {
	console.log((e.target.value));
	const delAttr = e.target.value;
	try {
		const response = await postData(`./${delAttr}/del`, { delAttr });
		if (response.status == 0) //서버에서 트랜젝션 처리 실패시, throw
			throw(Error);
		else
		{
		}
	} catch (e) {
		alert("삭제 실패");
	}
}

export default delAttrListener;
