require("./chart");

Balanced.VerticalBarChartView = Balanced.ChartView.extend({
	_chartModel: "triangleBar",
	classNames: ['vertical-bar-chart'],

	options: function() {
		return {
			width: 435,
			height: 300,
			rectClass: 'triangle',
			showValues: true
		};
	}.property()
});
