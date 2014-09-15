Balanced.ChartView = Ember.View.extend({
	tagName: 'div',
	classNames: ['chart'],
	data: {},
	axis: {},
	regions: {},
	grid: {},
	transition: {},
	legend: {},
	tooltip: {},
	subchart: {},
	zoom: {},
	size: {},
	padding: {},
	type: null,
	color: {
		pattern: ['#639ABD', '#BC8F30', '#9364A8', '#00A08E']
	},
	// @egyptianBlue80, @turmericYellow80, @byzantiumPurple80, @forestGreen80

	spline: {},
	bar: {},

	_chart: undefined,

	chart: function() {
		var self = this;
		if (Ember.isEqual(self.get('_chart'), undefined)) {
			// Empty, create it.
			var container = self.get('element');
			if (Ember.isEqual(container, undefined)) {
				return undefined;
			} else {
				var config = self.get('_config');
				var chart = c3.generate(config);
				self.set('_chart', chart);
				return chart;
			}
		} else {
			// Editor is already created and cached.
			return self.get('_chart');
		}
	}.property('element', '_config'),

	_config: function() {
		var c = this.getProperties([
			'data',
			'axis',
			'regions',
			'bar',
			'grid',
			'legend',
			'tooltip',
			'subchart',
			'zoom',
			'size',
			'padding',
			'color',
			'transition'
		]);
		c.data.type = this.get('type');
		c.bindto = this.get('element');
		return c;
	}.property('element', 'data', 'type', 'axis', 'regions', 'bar', 'grid', 'legend', 'tooltip', 'subchart', 'zoom', 'size', 'padding', 'color', 'transition'),

	dataDidChange: function() {
		var chart = this.get('chart');
		chart.load(this.get('data'));
	}.observes('data').on('didInsertElement'),

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
