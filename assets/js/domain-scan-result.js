const postData = async(url = '', data = {}) =>
{
	// Default options are marked with *
	const response = await fetch(url, 
	{
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
		  'Content-Type': 'application/json'
		  // 'Content-Type': 'application/x-www-form-urlencoded',
	},
	redirect: 'follow', // manual, *follow, error
	referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
	body: JSON.stringify(data) // body data type must match "Content-Type" header
	});
	return response.json(); // parses JSON response into native JavaScript objects
}

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
