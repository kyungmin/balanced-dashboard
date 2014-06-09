Balanced.ChartComponent = Ember.Component.extend({
	tagName: 'svg',
	classNames: ['chart-container'],

	chartData: null,
	_chart: null,
	_chartModel: null,

	x: null,
	y: null,

	chartModel: function() {
		return nv.models[this.get('_chartModel')]();
	}.property("_chartModel"),

	margin: function() {
		return {
			top: 0,
			bottom: 0,
			left: 0,
			right: 0
		}
	}.property(),

	options: function() {
		var self = this;

		return {
			showXAxis: true,
			showYAxis: true,
			showControls: true,
			showLegend: false
		};
	}.property('showControls', 'showLegend'),

	chart: function() {
		var self = this;
		var chart = self.get('_chart');

		if (!chart) {
			chart = self.get('chartModel');
		}

		chart.useInteractiveGuideline(true);

		chart.xAxis
		.axisLabel('Time (ms)')
		.tickFormat(d3.format(',r'));

		chart.yAxis
		.axisLabel('Voltage (v)')
		.tickFormat(d3.format('.02f'));

		chart.margin(self.get('margin'))
			.options(self.get('options'));

	    return chart;
	}.property('chartModel', 'margin', 'options'),

	didInsertElement: function() {
		var self = this;
		var $el = self.$();
		var el = $el.get(0);
		nv.addGraph(function() {
			return self.get('chart');
		});
	},

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

	}.observes('chartData','chart').on('didInsertElement')
});


Balanced.LineChart = Balanced.ChartComponent.extend({
	_chartModel: "lineChart",

	chartData: function() {
		var sin = [],
			cos = [];

		for (var i = 0; i < 100; i++) {
			sin.push({x: i, y: Math.sin(i/10)});
			cos.push({x: i, y: .5 * Math.cos(i/10)});
		}

		return [
			{
				values: sin,
				key: 'Sine Wave',
				color: '#ff7f0e'
			},
			{
				values: cos,
				key: 'Cosine Wave',
				color: '#2ca02c'
			}
		];
	}.property()
});

Ember.Handlebars.helper('line-chart', Balanced.LineChart);
