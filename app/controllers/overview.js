Balanced.MarketplaceOverviewController = Balanced.ObjectController.extend(
	Ember.Evented,
	Balanced.ResultsTable, {
		needs: ['marketplace'],
		baseClassSelector: '#overview',
		pageTitle: 'Overview',

		init: function() {
			this._super();
			this.loadAnalytics();
		},

		totalVolume: [],
		transactionsCount: [],

		loadAnalytics: function() {
			var connection = Balanced.Connections.ApiConnection.create();
			var self = this;

			connection.ajax({
				uri: "/analytics?type=volume"
			}).then(function(response) {
				var transactions = response.analytics.map(function(day) {
					return day.transactions.map(function(transaction) {
						return _.extend({}, transaction, {
							start_at: day.start_at
						});
					});
				});
				transactions = _.flatten(transactions);
				self.group(transactions);
			});
		},

		group: function(data) {
			var cf = crossfilter(data);
			var byType = cf.dimension(function(p) {
				return p.type;
			});

			var groupByType = byType.group();
			groupByType.top(Infinity).forEach(function(p, i) {
				console.log(p.key + ": " + p.value);
			});
		},

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
