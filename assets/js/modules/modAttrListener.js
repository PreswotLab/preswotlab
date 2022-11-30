import postData from "./postData.js";

const modAttrListener = async (e) => {
	console.log((e.target.value));
	const modAttr = e.target.value; //바꾸고 싶은 현재 속성
	const chhAttr = prompt("바꾸고 싶은 속성을 입력하세요");
	try {
		const response = await postData(`./${modAttr}/mod`, { modAttr, chhAttr });
		if (response.status == 0) //서버에서 트랜젝션 처리 실패시, throw
			throw(Error);
		else
		{
		}
	} catch (e) {
		alert("변경 실패");
	}
}

export default modAttrListener;
