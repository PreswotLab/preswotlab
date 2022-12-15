import {insertCategoryChild, insertNumericScanChild} from "./insertScanChild.js";
import putData from "./putData.js";

const modAttrListener = async (e) => {
	const modAttrName = e.target.value; //바꾸고 싶은 현재 속성
	const tableName = document.getElementById('tableName').innerHTML;
	const tableSeq = window.location.pathname.split('/')[3];
	const chgType = prompt("바꾸고 싶은 속성을 입력하세요");//바꾸고자하는 속성
	if (!chgType)
		return ;
	try {
		const response = await putData(`./${tableSeq}/mod`, { modAttrName, chgType });
		if (response.status == 0) //서버에서 트랜젝션 처리 실패시, throw
			throw(Error);
		else
		{
			console.log(response.scanResult);
			if (response.attrType == 'N') //수치속성 스캔결과에 넣기
				insertNumericScanChild(response.scanResult);
			else
				insertCategoryChild(response.scanResult);
		}
	} catch (e) {
		alert("변경 실패");
	}
}

export default modAttrListener;
