const changeNumericInnerHtml = (scanResult) => {
	let c_td_elem;

	for (let i = 0; i < 10; i++)
	{
		c_td_elem = document.getElementById(`c_td_${scanResult.attrName}_${i}`);
		if (c_td_elem)
			c_td_elem.id = `n_td_${scanResult.attrName}_${i}`;
	}
	document.getElementById(`n_td_${scanResult.attrName}_1`).innerHTML = scanResult.attrType;
	document.getElementById(`n_td_${scanResult.attrName}_2`).innerHTML = scanResult.numOfNullRecords;
	document.getElementById(`n_td_${scanResult.attrName}_3`).innerHTML = scanResult.portionOfNullRecords;
	document.getElementById(`n_td_${scanResult.attrName}_4`).innerHTML = scanResult.numOfDistinct;
	document.getElementById(`n_td_${scanResult.attrName}_5`).innerHTML = scanResult.max;
	document.getElementById(`n_td_${scanResult.attrName}_6`).innerHTML = scanResult.min;
	document.getElementById(`n_td_${scanResult.attrName}_7`).innerHTML = scanResult.numOfZero;
	document.getElementById(`n_td_${scanResult.attrName}_8`).innerHTML = scanResult.portionOfZero;
	document.getElementById(`n_td_${scanResult.attrName}_9`).innerHTML = scanResult.recommended;
}

export const insertNumericScanChild = (scanResult) => {
	//만약에 부모노드가 numeric_table이라면 innerhtml 값만 바꾸면된다.
	//만약 부모노드가 category_table이라면 td 2를 삽입해야한다.
	const trToMove = document.getElementById(`tr_${scanResult.attrName}`);
	const parentTrNode = trToMove.parentNode;
	if (parentTrNode.id == 'category_tbody')
	{
		const newNode1 = document.createElement("td");
		newNode1.id = `n_td_${scanResult.attrName}_8`;
		const newNode2 = document.createElement("td");
		newNode2.id = `n_td_${scanResult.attrName}_9`;

		trToMove.insertBefore(newNode1, document.getElementById(`c_td_${scanResult.attrName}_7`).nextElementSibling);
		trToMove.insertBefore(newNode2, document.getElementById(`c_td_${scanResult.attrName}_7`).nextElementSibling);
		changeNumericInnerHtml(scanResult);
		const removedTr = parentTrNode.removeChild(trToMove); //DOM에서 삭제하고 리턴, 메모리에 존재.
		const numerictTbody = document.getElementById('numeric_tbody');
		numerictTbody.appendChild(removedTr);
	}
	else
	{
		changeNumericInnerHtml(scanResult);
	}
}

// 0td#td_PHONE_NUM_attr_name
// 1td#td_PHONE_NUM_d_type
// 2td
// 3td
// 4td#td_PHONE_NUM_null_num
// 5td#td_PHONE_NUM_null_portion
// 6td#td_PHONE_NUM_diff_num
// 7td#td_PHONE_NUM_special_num
// 8td#td_PHONE_NUM_special_portion
// 9td#td_PHONE_NUM_key_candidate
// 10td
// 11td
/*
*0
:
0td#td_TEST_YMD_attr_name
1td#td_TEST_YMD_d_type
4td#td_TEST_YMD_null_num
5td#td_TEST_YMD_null_portion
6td#td_TEST_YMD_diff_num
7td#td_TEST_YMD_max_value
8td#td_TEST_YMD_min_value
9td#td_TEST_YMD_zero_num
10td#td_TEST_YMD_zero_portion
11td#td_TEST_YMD_key_candidate
12td
13td
*/

const changeCategoryInnerHtml = (scanResult) =>
{
	let n_td_elem;

	for (let i = 0; i < 8; i++)
	{
		n_td_elem = document.getElementById(`n_td_${scanResult.attrName}_${i}`);
		if (n_td_elem)
			n_td_elem.id = `c_td_${scanResult.attrName}_${i}`;
	}
	document.getElementById(`c_td_${scanResult.attrName}_1`).innerHTML = scanResult.attrType;
	document.getElementById(`c_td_${scanResult.attrName}_2`).innerHTML = scanResult.numOfNullRecords;
	document.getElementById(`c_td_${scanResult.attrName}_3`).innerHTML = scanResult.portionOfNullRecords;
	document.getElementById(`c_td_${scanResult.attrName}_4`).innerHTML = scanResult.numOfDistinct;
	document.getElementById(`c_td_${scanResult.attrName}_5`).innerHTML = scanResult.numOfSpcRecords;
	document.getElementById(`c_td_${scanResult.attrName}_6`).innerHTML = scanResult.portionOfSpcRecords;
	document.getElementById(`c_td_${scanResult.attrName}_7`).innerHTML = scanResult.recommended;
}

export const insertCategoryChild = (scanResult) => {
	console.log(scanResult)
	//만약 부모가 category_table이라면 값만 바꾸면되나, 
	//numerict이라면, td 2개를 삭제해야한다.
	const trToMove = document.getElementById(`tr_${scanResult.attrName}`);
	const parentTrNode = trToMove.parentNode;
	if (parentTrNode.id == 'numeric_tbody')
	{
		document.getElementById(`n_td_${scanResult.attrName}_8`).remove();
		document.getElementById(`n_td_${scanResult.attrName}_9`).remove();
		changeCategoryInnerHtml(scanResult);
		const removedTr = parentTrNode.removeChild(trToMove); //DOM에서 삭제하고 리턴, 메모리에 존재.
		const categoryTbody = document.getElementById("category_tbody");
		categoryTbody.appendChild(removedTr);
	}
	else
	{
		changeCategoryInnerHtml(scanResult)
	}
}
