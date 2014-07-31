(function() {
	module('Payments (non-deterministic)', {
		setup: function() {
			Testing.setupMarketplace();
			Testing.createDebits();
			Ember.run(function() {
				var controller = Balanced.__container__.lookup('controller:marketplace_transactions');
				controller.set("limit", 2);
			});
		},
		teardown: function() {
			Testing.restoreMethods(
				Balanced.Adapter.create
			);
		}
	});

	var assertQueryString = function(string, expected, assert) {
		var qsParameters = Balanced.Utils.queryStringToObject(string);
		_.each(expected, function(value, key) {
			assert.deepEqual(qsParameters[key], value, "Query string parameter %@".fmt(key));
		});
	};

	var getResultsUri = function() {
		var controller = Balanced.__container__.lookup('controller:marketplace_transactions');
		return controller.get("resultsLoader.resultsUri");
	};

	test('Click load more shows 2 more and hides load more', function(assert) {
		visit(Testing.ACTIVITY_ROUTE)
			.checkElements({
				'#activity .results table.transactions tfoot td': 1
			}, assert)
			.then(function() {
				var resultsUri = getResultsUri();
				assert.deepEqual(resultsUri.split("?")[0], '/transactions', 'Activity Transactions URI is correct');
				assertQueryString(resultsUri, {
					limit: "2",
					offset: "0",
					q: "",
					sort: "created_at,desc",
					"status[in]": "failed,succeeded,pending",
					"type[in]": "debit,credit,hold,refund"
				}, assert);
			})
			.assertClick('#activity .results table.transactions tfoot tr.load-more-results a', assert)
			.then(function() {
				var resultsUri = getResultsUri();
				assertQueryString(resultsUri, {
					limit: "2",
					sort: "created_at,desc",
					"status[in]": "failed,succeeded,pending",
					"type[in]": "debit,credit,hold,refund"
				}, assert);
			})
			.checkElements({
				"#activity .results table.transactions tbody tr": 4,
				"#activity .results table.transactions tfoot td": 0
			}, assert);
	});

	test('Filter Activity transactions table by type & status', function(assert) {
		visit(Testing.ACTIVITY_ROUTE)
			.click('#activity .results table.transactions th.type .type-filter li a:contains(Holds)')
			.then(function() {
				var resultsUri = getResultsUri();
				assert.deepEqual(resultsUri.split("?")[0], '/transactions', 'Activity Transactions URI is correct');
				assertQueryString(resultsUri, {
					type: "hold",
					'status[in]': 'failed,succeeded,pending',
					limit: "2",
					offset: "0",
					q: "",
					sort: "created_at,desc"
				}, assert);
			})
			.checkElements({
				'#activity .results table.transactions tr td.no-results': 1
			}, assert)
			.click('#activity .results table.transactions th.type .type-filter li a:contains(All)')
			.click('#activity .results table.transactions th.status .status-filter li a:contains(Succeeded)')
			.then(function() {
				assertQueryString(getResultsUri(), {
					status: "succeeded",
					"type[in]": "debit,credit,hold,refund",
					limit: "2",
					offset: "0",
					q: "",
					sort: "created_at,desc"
				}, assert);
			})
			.checkElements({
				'#activity .results table.transactions tr tr.load-more-results': 1
			}, assert)
			.click('#activity .results table.transactions th.type .type-filter li a:contains(Debits)')
			.then(function() {
				assertQueryString(getResultsUri(), {
					status: "succeeded",
					type: "debit"
				}, assert);
			})
			.checkElements({
				'#activity .results table.transactions tr td.no-results': 0
			}, assert);
	});
})();
