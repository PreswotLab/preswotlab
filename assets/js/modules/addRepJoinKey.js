import { postData } from "./postData";

export const addRepJoinKey = async (e) => {
	const name = prompt ("추가하고자하는 대표 결합키를 입력하세요");
	if (!name)
		e.target.value = "-";
	else //입력 받았을때만 post 요청 날립니다.
	{
		await postData('/api/addRepJoinKey', { name }).then((data) => 
		{
			console.log(data); // JSON data parsed by `data.json()` call
			if (data.status == 1)
			{
				const repJoinKeySelects = document.getElementsByClassName("repJoinKey");
				for (let i = 0; i < repJoinKeySelects.length; i++)
				{
					let option = document.createElement("option");
					option.innerHTML = name;
					option.value = name;
					console.log(option);
					repJoinKeySelects[i].add(option, 1);
				}
			}
		});
		e.target.value = name;
	}
};
