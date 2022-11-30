import addRepJoinKey from "./modules/addRepJoinKey.js";
import addRepAttr from "./modules/addRepAttr.js";

const repSelectListener = async (e) => {
	try {
		if (e.target.value == "addRepAttr")
			await addRepAttr(e);
		else if (e.target.value == "addRepJoinKey")
			await addRepJoinKey(e);
	} catch (e) {
		console.log(e);
	}
}

export default repSelectListener;
