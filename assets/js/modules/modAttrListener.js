import postData from "./postData.js";

const modAttrListener = async (e) => {
	try {
		const modAttrName = e.target.value; //바꾸고 싶은 현재 속성
		const chgType = prompt("바꾸고 싶은 속성을 입력하세요");//바꾸고자하는 속성
		if (!chgType)
			return ;
		const tableName = document.getElementById('tableName').innerHTML;
		const response = await postData(`./${tableName}/mod`, { modAttrName, chgType });
		console.log(response);
		if (response.status == 0) //서버에서 트랜젝션 처리 실패시, throw
			throw(Error);
		else
		{
			console.log(response.scanResult);
		}
	} catch (e) {
		console.log(e.message);
		alert("변경 실패");
	}
}

export default modAttrListener;
