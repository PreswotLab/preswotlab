export const makeChartOption = (data) => {
	const arr = [];
	arr.push(data);
	return ({
		series: [
			{
				data: arr
			}
		],
		chart: {
			type: 'boxPlot',
			height: 350
		},
		title: {
			text: `${data['x']} Boxplot`,
			align: 'left'
		},
		plotOptions: {
			bar: {
				horizontal: true,
				barHeight: '50%'
		},
		boxPlot: {
			colors: {
				upper: '#e9ecef',
				lower: '#f8f9fa'
				}
			}
		},
		stroke: {
		  colors: ['#6c757d']
		}
	});
}
