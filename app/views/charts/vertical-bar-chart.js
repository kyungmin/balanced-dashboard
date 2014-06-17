Balanced.VerticalBarChartView = Balanced.ChartView.extend({
	_chartModel: "triangleBar",
	classNames: ['vertical-bar-chart'],

	options: function() {
		return {
			height: 300,
			rectClass: 'triangle',
			showValues: true
		};
	}.property(),

	chartData: function() {
		return [{
			key: "Cumulative Return",
			values: [{
				x: "A Label",
				y: 29.765957771107
			}, {
				x: "B Label",
				y: 0
			}, {
				x: "C Label",
				y: 32.807804682612
			}, {
				x: "D Label",
				y: 96.45946739256
			}, {
				x: "E Label",
				y: 0.19434030906893
			}]
		}];
	}.property()
});
