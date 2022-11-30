import postData from "./postData.js";

const addRepAttr = async (e) => {
	const name = prompt ("추가하고자하는 대표 속성을 입력하세요");
	if (!name)
		e.target.value = "-";
	else //입력 받았을때만 post요청 날립니다.
	{
		await postData('/api/addRepAttr', { name }).then((data) => 
		{
			console.log(data); // JSON data parsed by `data.json()` call
			if (data.status == 1)
			{
				const repAttrSelects = document.getElementsByClassName("repAttr");
				for (let i = 0; i < repAttrSelects.length; i++)
				{
					let option = document.createElement("option");
					option.innerHTML = name;
					option.value = name;
					console.log(option);
					repAttrSelects[i].add(option, 1);
				}
			}
		});
		e.target.value = name;
	}
};

export default addRepAttr;
