require("./chart");

Balanced.HorizontalBarChartView = Balanced.ChartView.extend({
	_chartModel: "discreteBar",
	classNames: ['horizontal-bar-chart'],

	options: function() {
		return {
			width: 300,
			height: 435,
			showValues: true
		};
	}.property()
});
