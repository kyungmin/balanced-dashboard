Balanced.ChartView = Ember.View.extend({
	tagName: 'svg',
	classNames: ['chart-container'],

	_chartModel: null,
	chartModel: function() {
		return nv.models[this.get('_chartModel')]();
	}.property("_chartModel"),

	width: 500,
	height: 500,
	xAxisLabel: 'Date',
	yAxisLabel: 'Volume',

	x: null,
	y: null,
	chartData: null,
	options: {},

	_chart: null,
	chart: function() {
		var self = this;
		var chart = self.get('_chart');

		if (!chart) {
			chart = self.get('chartModel');
		}

		chart.options(self.get('options'));

		return chart;
	}.property('chartModel', 'margin', 'options'),

	updateChart: function() {
		var self = this;
		var el = self.get('element');
		var chartData = self.get('chartData');
		var chart = self.get('chart');

		d3.select(el)
			.datum(chartData)
			.transition()
			.duration(250)
			.call(chart);

		self.set('_chart', chart);
		nv.utils.windowResize(chart.update);

	}.observes('chartData', 'chart').on('didInsertElement'),

	didInsertElement: function() {
		var self = this;
		var $el = self.$();
		var el = $el.get(0);
		nv.addGraph(function() {
			return self.get('chart');
		});
	}
});
