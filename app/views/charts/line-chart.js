require("./chart");

Balanced.LineChartView = Balanced.ChartView.extend({
	_chartModel: "lineChart",
	classNames: ['line-chart'],
	customizeChart: function(chart) {
		chart.interactiveLayer.tooltip.contentGenerator(function(data) {
			var html = '';

			_.each(data, function(series) {
				_.each(series, function(p) {
					html += '<div><h4>%@</h4><p>%@</p></div>'.fmt(p.key, p.value);
				})
			});

			return html;
		});

		chart.xAxis.tickFormat(function(d) {
			var date = new Date()
			date.setTime(d);
			return d3.time.format('%x')(date);
		});

		return chart;
	},

	options: function() {
		var self = this;

		return {
			width: 800,
			showXAxis: true,
			showYAxis: true,
			showLegend: true,
			rightAlignYAxis: false,
			useInteractiveGuideline: true,
			noData: 'No data available.',
			tooltips: true,
			showLegend: false
		};
	}.property('chart')
});
