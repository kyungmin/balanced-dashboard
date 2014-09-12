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
			var byDate = cf.dimension(function(p) {
				return p.start_at;
			});

			var byType = cf.dimension(function(p) {
				return p.type;
			});

			var groupByType = byDate.group();

			var dates = groupByType.all().map(function(transaction) {
				return Date.parseISO8601(transaction.key);
			});
			dates = ['x'].concat(dates);

			var debitCount = ['debits'];
			var creditCount = ['credits'];
			var refundCount = ['refunds'];
			var reversalCount = ['reversals'];

			var debitAmount = ['debits'];
			var creditAmount = ['credits'];
			var refundAmount = ['refunds'];
			var reversalAmount = ['reversals'];

			byType.filterExact('debit');
			byType.top(Infinity).forEach(function(p, i) {
				debitCount.push(p.count);
				debitAmount.push(p.amount);
			});

			byType.filterExact('credit');
			byType.top(Infinity).forEach(function(p, i) {
				creditCount.push(p.count);
				creditAmount.push(p.amount);
			});

			byType.filterExact('refund');
			byType.top(Infinity).forEach(function(p, i) {
				refundCount.push(p.count);
				refundAmount.push(p.amount);
			});

			byType.filterExact('reversal');
			byType.top(Infinity).forEach(function(p, i) {
				reversalCount.push(p.count);
				reversalAmount.push(p.amount);
			});

			this.set("totalVolume", {
				x: 'x',
				columns: [dates, debitAmount, creditAmount, refundAmount, reversalAmount],
				type: 'spline'
			});

			this.set("transactionsCount", {
				x: 'x',
				columns: [dates, debitCount, creditCount, refundCount, reversalCount],
				type: 'spline'
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
