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


Balanced.LineChartView = Balanced.ChartView.extend({
	_chartModel: "lineChart",
	classNames: ['line-chart'],

	options: function() {
		return {
			width: 500,
			showXAxis: true,
			showYAxis: true,
			showLegend: true,
			rightAlignYAxis: false,
			useInteractiveGuideline: true,
			noData: 'No data available.',
			tooltips: true
		};
		// xAxis
		// 	.axisLabel(self.get('xAxisLabel'))
		// 	.tickFormat(d3.format(',r'))
		// 	.tickPadding(7);

		// yAxis
		// 	.axisLabel(self.get('yAxisLabel'))
		// 	.tickFormat(d3.format('.02f'));
	}.property(),

	chartData: function() {
		var sin = [],
			cos = [];

		for (var i = 0; i < 100; i++) {
			sin.push({
				x: i,
				y: Math.sin(i / 10)
			});
			cos.push({
				x: i,
				y: .5 * Math.cos(i / 10)
			});
		}

		return [{
			values: sin,
			key: 'Sine Wave',
			color: '#ff7f0e'
		}, {
			values: cos,
			key: 'Cosine Wave',
			color: '#2ca02c'
		}];
	}.property()
});

Balanced.HorizontalBarChartView = Balanced.ChartView.extend({
	_chartModel: "discreteBar",
	classNames: ['horizontal-bar-chart'],

	options: function() {
		return {
			width: 300,
			useInteractiveGuideline: true,
			tooltips: true,
			showValues: true
		}
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
		}]
	}.property()
});

Balanced.VerticalBarChartView = Balanced.ChartView.extend({
	_chartModel: "triangleBar",
	classNames: ['vertical-bar-chart'],

	options: function() {
		return {
			height: 300,
			useInteractiveGuideline: true,
			tooltips: true,
			rectClass: 'triangle',
			showValues: true
		}
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
		}]
	}.property()
});
