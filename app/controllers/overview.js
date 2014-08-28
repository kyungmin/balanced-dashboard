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

		transactionsVolume: [],
		transactionsCount: [],

		loadAnalytics: function() {
			var connection = Balanced.Connections.ApiConnection.create();
			var self = this;

			connection.ajax({
				uri: "/analytics?type=volume"
			}).then(function(response) {
				self.fetchTransactionsVolume(response.analytics);
				self.fetchTransactionsCount(response.analytics);
			});
		},

		fetchTransactionsVolume: function(days) {
			var DebitVolume = [],
				CreditVolume = [],
				RefundVolume = [],
				ReversalVolume = [];

			var TRANSACTION_TYPES = {
				'debit': DebitVolume,
				'credit': CreditVolume,
				'refund': RefundVolume,
				'reversal': ReversalVolume,
			};

			days.forEach(function(day) {
				day.transactions.forEach(function(transaction) {
					console.log(day.start_at, transaction.amount)
					TRANSACTION_TYPES[transaction.type].push({
						x: day.start_at,
						y: transaction.amount
					});
				});
			});

			this.set('transactionsVolume', [{
				key: 'Debits',
				values: DebitVolume
			}, {
				key: 'Credits',
				values: CreditVolume
			}, {
				key: 'Refunds',
				values: RefundVolume
			}, {
				key: 'Reversals',
				values: ReversalVolume
			}]);
		},

		fetchTransactionsCount: function(data) {
			var DebitCount = [],
				CreditCount = [],
				RefundCount = [],
				ReversalCount = [];

			var TRANSACTION_TYPES = {
				'debit': DebitCount,
				'credit': CreditCount,
				'refund': RefundCount,
				'reversal': ReversalCount,
			};

			days.forEach(function(day) {
				day.transactions.forEach(function(transaction) {
					console.log(day.start_at, transaction.amount)
					TRANSACTION_TYPES[transaction.type].push({
						x: day.start_at,
						y: transaction.count
					});
				});
			});

			this.set('transactionsCount', [{
				key: 'Debits',
				values: DebitCount
			}, {
				key: 'Credits',
				values: CreditCount
			}, {
				key: 'Refunds',
				values: RefundCount
			}, {
				key: 'Reversals',
				values: ReversalCount
			}]);
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
