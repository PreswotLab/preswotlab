import { postData } from "./postData.js";

const addRepOptions = document.getElementsByClassName("repSelect");

const addRepAttr = async (e) => {
	const name = prompt ("추가하고자하는 대표 속성을 입력하세요");
	if (!name)
		e.target.value = "-";
	if (name) //입력 받았을때만 post요청 날립니다.
	{
		await postData('/api/addRepAttr', { name }).then((data) => 
		{
			console.log(data); // JSON data parsed by `data.json()` call

		});
	}
};

const addRepJoinKey = async (e) => {
	const name = prompt ("추가하고자하는 대표 결합키를 입력하세요");
	if (!name)
		e.target.value = "-";
	if (name) //입력 받았을때만 post 요청 날립니다.
	{
		await postData('/api/addRepJoinKey', { name }).then((data) => 
		{
			console.log(data); // JSON data parsed by `data.json()` call
		});
	}
};

const handleListener = async (e) => {
	try {
		if (e.target.value == "addRepAttr")
			await addRepAttr(e);
		else if (e.target.value == "addRepJoinKey")
			await addRepJoinKey(e);
	} catch (e) {
		console.log(e);
	}
};

for (let i = 0; i < addRepOptions.length; i++)
{
	addRepOptions[i].addEventListener('change', handleListener)
};
