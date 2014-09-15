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
				self.formatTransactions(transactions);
			});
		},

		formatTransactions: function(data) {
			var cf = crossfilter(data);

			var debitCount = ['debits'];
			var creditCount = ['credits'];
			var refundCount = ['refunds'];
			var reversalCount = ['reversals'];

			var debitAmount = ['debits'];
			var creditAmount = ['credits'];
			var refundAmount = ['refunds'];
			var reversalAmount = ['reversals'];

			function reduceAdd(type) {
				return function(p, v) {
					if (v["type"] === type) {
						p.count += v.count;
						p.amount += v.amount;
					}
					return p;
				};
			}

			function reduceRemove(type) {
				return function(p, v) {
					if (v["type"] === type) {
						p.count -= v.count;
						p.amount -= v.amount;
					}
					return p;
				};
			}

			function reduceInitial() {
				return {
					count: 0,
					amount: 0
				};
			}

			// group transactions by date
			var transactionsByDate = cf.dimension(function(p) {
				return p.start_at;
			});

			var dates = transactionsByDate.group().all().map(function(transaction) {
				return Date.parseISO8601(transaction.key);
			});
			dates = ['x'].concat(dates);

			var debits = transactionsByDate.group().reduce(reduceAdd('debit'), reduceRemove('debit'), reduceInitial).all();

			debitAmount = debitAmount.concat(_.map(debits, function(debit) {
				return debit.value.amount
			}));

			debitCount = debitCount.concat(_.map(debits, function(debit) {
				return debit.value.count
			}));

			var credits = transactionsByDate.group().reduce(reduceAdd('credit'), reduceRemove('credit'), reduceInitial).all();

			creditAmount = creditAmount.concat(_.map(credits, function(credit) {
				return credit.value.amount
			}));

			creditCount = creditCount.concat(_.map(credits, function(credit) {
				return credit.value.count
			}));

			var refunds = transactionsByDate.group().reduce(reduceAdd('refund'), reduceRemove('refund'), reduceInitial).all();

			refundAmount = refundAmount.concat(_.map(refunds, function(refund) {
				return refund.value.amount
			}));

			refundCount = refundCount.concat(_.map(refunds, function(refund) {
				return refund.value.count
			}));

			var reversals = transactionsByDate.group().reduce(reduceAdd('reversal'), reduceRemove('reversal'), reduceInitial).all();

			reversalAmount = reversalAmount.concat(_.map(reversals, function(reversal) {
				return reversal.value.amount
			}));

			reversalCount = reversalCount.concat(_.map(reversals, function(reversal) {
				return reversal.value.count
			}));

			this.set("totalVolume", {
				x: 'x',
				columns: [dates, debitAmount, creditAmount, refundAmount, reversalAmount]
			});

			this.set("transactionsCount", {
				x: 'x',
				columns: [dates, debitCount, creditCount, refundCount, reversalCount]
			});

			this.set("verticalBarChartData", {
				x: 'x',
				columns: [dates, debitCount]
			});

			this.set("horizontalBarChartData", {
				x: 'x',
				columns: [dates, debitCount]
			});
		},

	});
