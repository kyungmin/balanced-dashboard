Balanced.ChartWithLegendView = Ember.View.extend({});

Balanced.LineChartWithLegendView = Balanced.ChartWithLegendView.extend({
	templateName: 'charts/line-chart-with-legend',
	data: function() {
		var controller = this.get('controller');
		var chartName = this.get('chartName');
		console.log(chartName);
		return controller.get(chartName);
	}.property('controller', 'chartName')
});
