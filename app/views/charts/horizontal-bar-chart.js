require("./chart");

Balanced.HorizontalBarChartView = Balanced.ChartView.extend({
	_chartModel: "discreteBar",
	classNames: ['horizontal-bar-chart'],

	options: function() {
		return {
			width: 300,
			showValues: true
		};
	}.property()
});
