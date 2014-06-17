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
			// tooltipContent: function(key, x, y, e, graph) {
			// 	return '<h3>' + key + '</h3>' + '<p>$' + y + '</p>';
			// }
		};
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
				y: 0.5 * Math.cos(i / 10)
			});
		}

		return [{
			values: sin,
			key: 'Sine Wave'
		}, {
			values: cos,
			key: 'Cosine Wave'
		}];
	}.property()
});
