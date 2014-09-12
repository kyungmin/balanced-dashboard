require("./chart");

Balanced.LineChartView = Balanced.ChartView.extend({
	axis: {
		x: {
			type: 'timeseries',
			tick: {
				format: function(x) {
					return d3.time.format('%x')(x);
				}
			}
		}
	},
	size: {
		width: 600,
		height: 320
	}
});
