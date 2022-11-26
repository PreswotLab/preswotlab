import { postData } from "./postData";

const addRepOptions = document.getElementsByClassName("repSelect");

const addRepAttr = async () => {
	const name = prompt ("추가하고자하는 대표 속성을 입력하세요");
	postData('/api/addRepAttr', { name }).then((data) => 
	{
		console.log(data); // JSON data parsed by `data.json()` call
	});
};

const addRepJoinKey = async () => {
	const name = prompt ("추가하고자하는 대표 결합키를 입력하세요");
	postData('/api/addRepJoinKey', { name }).then((data) => 
	{
		console.log(data); // JSON data parsed by `data.json()` call
	});
};

const handleListener = async (e) => {
	try {
		if (e.target.value == "addRepAttr")
			await addRepAttr();
		else if (e.target.value == "addRepJoinKey")
			await addRepJoinKey();
	} catch (e) {
		console.log(e);
	}
};

for (let i = 0; i < addRepOptions.length; i++)
{
	addRepOptions[i].addEventListener('change', handleListener)
};
