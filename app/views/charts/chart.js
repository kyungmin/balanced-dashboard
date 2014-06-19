Balanced.ChartView = Ember.View.extend({
	tagName: 'svg',
	classNames: ['chart-container'],

	_chartModel: null,
	chartModel: function() {
		return window.nv.models[this.get('_chartModel')]();
	}.property("_chartModel"),

	width: 500,
	height: 500,
	x: null,
	y: null,
	data: null,
	options: {},

	_chart: null,

	chart: function() {
		var self = this;
		var chart = self.get('_chart');

		if (!chart) {
			chart = self.get('chartModel');
		}

		chart.color(['#639ABD', '#BC8F30', '#9364A8', '#00A08E']);
		// @egyptianBlue80, @turmericYellow80, @byzantiumPurple80, @forestGreen80

		chart.options(self.get('options'));
		return self.get('customizeChart').apply(self, [chart]);
	}.property('chartModel', 'margin', 'options', 'customizeChart'),

	customizeChart: function(chart) {
		return chart;
	},

	updateChart: function() {
		var self = this;
		var el = self.get('element');
		var data = self.get('data');
		var chart = self.get('chart');

		window.d3.select(el)
			.datum(data)
			.transition()
			.duration(250)
			.call(chart);

		self.set('_chart', chart);
		window.nv.utils.windowResize(chart.update);

	}.observes('data', 'chart').on('didInsertElement'),

	didInsertElement: function() {
		var self = this;
		var $el = self.$();
		var el = $el.get(0);

		window.nv.addGraph(function() {
			var chart = self.get('chart');

			$('circle.nv-point').attr("r", "5");

			return chart;
		});
	},

	actions: {
		toggleLegend: function(seriesKey) {
			var chart = this.get('chart');
			var data = this.get('data');

			data.filterBy('key', seriesKey).forEach(function(series) {
				series.disabled = !series.disabled;
			});

			if (data.isEvery('disabled')) {
				data.forEach(function(series) {
					series.disabled = false;
				});
			}

			chart.update();
		}
	}
});
