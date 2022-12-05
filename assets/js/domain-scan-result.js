import repSelectListener from "./modules/repSelectListner.js";

const selectTags = document.getElementsByClassName("repSelect");

for (let i = 0; i < selectTags.length; i++)
{
	selectTags[i].addEventListener('change', repSelectListener);
};
