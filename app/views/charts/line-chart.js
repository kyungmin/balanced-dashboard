Balanced.LineChartView = Balanced.ChartView.extend({
	_chartModel: "lineChart",
	classNames: ['line-chart'],

	options: function() {
		return {
			width: 500,
			showXAxis: true,
			showYAxis: true,
			showLegend: true,
			rightAlignYAxis: false,
			useInteractiveGuideline: true,
			noData: 'No data available.',
			tooltips: true
		};
		// xAxis
		// 	.axisLabel(self.get('xAxisLabel'))
		// 	.tickFormat(d3.format(',r'))
		// 	.tickPadding(7);

		// yAxis
		// 	.axisLabel(self.get('yAxisLabel'))
		// 	.tickFormat(d3.format('.02f'));
	}.property(),

	chartData: function() {
		var sin = [],
			cos = [];

		for (var i = 0; i < 100; i++) {
			sin.push({
				x: i,
				y: Math.sin(i / 10)
			});
			cos.push({
				x: i,
				y: .5 * Math.cos(i / 10)
			});
		}

		return [{
			values: sin,
			key: 'Sine Wave',
			color: '#ff7f0e'
		}, {
			values: cos,
			key: 'Cosine Wave',
			color: '#2ca02c'
		}];
	}.property()
});
