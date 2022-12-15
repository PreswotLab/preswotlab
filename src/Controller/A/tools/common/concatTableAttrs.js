export const concatTableAttrs = (query) => {
	//attr_name을 하나로 합쳐야합니다.
	const rtn = [];
	let cur;
	for (let i = 0; i < query.length; i++)
	{
		cur = query[i];
		//비어있거나, table_name이 다르다면
		if (rtn.length == 0 || rtn[rtn.length - 1]["table_name"] != cur['table_name'])
			rtn.push(query[i]); //push
		else
		{
			//마지막 원소의 attr_name의 뒤에 이름만 붙입니다.
			rtn[rtn.length - 1]['attr_name'] = rtn[rtn.length - 1]['attr_name'].concat(", ", cur['attr_name']);
		}
	}
	return (rtn);
}
