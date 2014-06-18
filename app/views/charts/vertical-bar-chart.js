Balanced.VerticalBarChartView = Balanced.ChartView.extend({
	_chartModel: "triangleBar",
	classNames: ['vertical-bar-chart'],

	options: function() {
		return {
			height: 300,
			rectClass: 'triangle',
			showValues: true
		};
	}.property()
});
