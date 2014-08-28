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
				self.fetchTotalVolume(response.analytics);
				self.fetchTransactionsCount(response.analytics);
			});
		},

		fetchTotalVolume: function(days) {
			var totalDebitVolume = [],
				totalCreditVolume = [],
				totalRefundVolume = [],
				totalReversalVolume = [];

			var TRANSACTION_TYPES = {
				'debit': totalDebitVolume,
				'credit': totalCreditVolume,
				'refund': totalRefundVolume,
				'reversal': totalReversalVolume,
			};

			days.forEach(function(day) {
				day.transactions.forEach(function(transaction) {
					TRANSACTION_TYPES[transaction.type].push({
						x: day["start_at"],
						y: transaction.amount
					});
				});
			});

			this.set('totalVolume', [{
				key: 'Debits',
				values: totalDebitVolume
			}, {
				key: 'Credits',
				values: totalCreditVolume
			}, {
				key: 'Refunds',
				values: totalRefundVolume
			}, {
				key: 'Reversals',
				values: totalReversalVolume
			}]);
		},

		fetchTransactionsCount: function(data) {
			var newData = data;
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
