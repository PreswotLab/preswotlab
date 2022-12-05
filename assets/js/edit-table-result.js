import repSelectListener from "./modules/repSelectListner.js";
import delAttrListener from "./modules/delAttrListener.js";
import modAttrListener from "./modules/modAttrListener.js";

const selectTags = document.getElementsByClassName("repSelect");
const delBtns = document.getElementsByClassName("delBtn");
const modBtns = document.getElementsByClassName("modBtn");

for (let i = 0; i < selectTags.length; i++)
{
	selectTags[i].addEventListener('change', repSelectListener);
	if (delBtns[i])
		delBtns[i].addEventListener('click', delAttrListener);
	if (modBtns[i])
		modBtns[i].addEventListener('click', modAttrListener);
};

