import postData from "./postData.js";

const addRepAttr = async (e) => {
	const name = prompt ("추가하고자하는 대표 속성을 입력하세요");
	if (!name)
		e.target.value = "-";
	else //입력 받았을때만 post요청 날립니다.
	{
		//request body에 name을 담아서 보냅니다.
		await postData('/api/addRepAttr', { name }).then((response) => 
		{
			console.log(response); // JSON data parsed by `data.json()` call
			if (response.status == 1) //status 1 : success
			{
				//현재 DOM의 repAttr select태그들에 option 추가
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
			else
				alert("속성 추가 실패");
		});
		e.target.value = name;
	}
};

export default addRepAttr;
