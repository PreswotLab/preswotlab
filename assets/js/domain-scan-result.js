import repSelectListener from "./modules/repSelectListner.js";
import getData from "./modules/getData.js";
import {makeChartOption} from "./modules/makeChartOption.js";
import {renderingBoxplot} from "./modules/renderingBoxplot.js";

const selectTags = document.getElementsByClassName("repSelect");
const container = document.getElementById('boxplot_container')
const tableName = document.getElementById('tableName').innerHTML;

for (let i = 0; i < selectTags.length; i++)
{
	selectTags[i].addEventListener('change', repSelectListener);
};

for (let i = 0; i < selectTags.length; i++)
{
	selectTags[i].addEventListener('change', repSelectListener);
};

try {
	let childNode;
	let option;
	const response = await getData(`/api/boxplot/${tableName}`);

	if (response.status == 0)
		throw(Error);
	for (let i = 0; i < response.data.length; i++)
	{
		childNode = document.createElement("div");
		container.appendChild(childNode);
		option = makeChartOption(response.data[i]);
		renderingBoxplot(childNode, option);
	}
} catch (e) {
	console.log(e.message);
}

