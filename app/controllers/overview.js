Balanced.MarketplaceOverviewController = Balanced.ObjectController.extend(
	Ember.Evented,
	Balanced.ResultsTable, {
		needs: ['marketplace'],
		baseClassSelector: '#overview',
		pageTitle: 'Overview',

		init: function() {
			this._super();
			this.fetchTotalVolume();
		},

		totalVolume: function() {
			var sin = [],
				cos = [];

			for (var i = 0; i < 100; i++) {
				sin.push({
					x: i,
					y: Math.sin(i / 10)
				});
				cos.push({
					x: i,
					y: 0.5 * Math.cos(i / 10)
				});
			}

			return [{
				values: sin,
				key: 'Sine Wave'
			}, {
				values: cos,
				key: 'Cosine Wave'
			}];
		}.property(),

		fetchTotalVolume: function() {
			var connection = Balanced.Connections.ApiConnection.create();
			var self = this;

			connection.ajax({
				uri: "/analytics?type=volume"
			}).then(function(response) {
				console.log(response.analytics);
				// process data
				self.set('totalVolume', []);
				console.log(self.get('totalVolume'));
			});
		},

		transactionsCount: function() {
			var sin = [],
				cos = [];

			for (var i = 0; i < 100; i++) {
				sin.push({
					x: i,
					y: Math.sin(i / 10)
				});
				cos.push({
					x: i,
					y: 0.5 * Math.cos(i / 10)
				});
			}

			return [{
				values: cos,
				key: 'Sine Wave'
			}, {
				values: sin,
				key: 'Cosine Wave'
			}];
		}.property(),

		verticalBarChartData: function() {
			return [{
				key: "Cumulative Return",
				values: [{
					x: "A Label",
					y: 29.765957771107
				}, {
					x: "B Label",
					y: 52.52
				}, {
					x: "C Label",
					y: 32.807804682612
				}]
			}];
		}.property(),

		horizontalBarChartData: function() {
			return [{
				key: "Cumulative Return",
				values: [{
					x: "A Label",
					y: 29.765957771107
				}, {
					x: "B Label",
					y: 10
				}, {
					x: "C Label",
					y: 32.807804682612
				}, {
					x: "D Label",
					y: 96.45946739256
				}]
			}];
		}.property()
	});
