import { addRepAttr } from "./modules/addRepAttr";
import { addRepJoinKey } from "./modules/addRepJoinKey";

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

const selectTags = document.getElementsByClassName("repSelect");

for (let i = 0; i < selectTags.length; i++)
{
	selectTags[i].addEventListener('change', handleListener)
};
