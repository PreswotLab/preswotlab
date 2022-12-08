export const renderingBoxplot = async (node, option) => {
	const chart = new ApexCharts(node, option);
	chart.render();
}
