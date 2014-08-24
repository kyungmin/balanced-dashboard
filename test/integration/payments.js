module('Payments', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createDebits();
		this.ADD_FUNDS_SELECTOR = ".nav-item .add-funds-btn";
		this.WITHDRAW_FUNDS_SELECTOR = ".nav-item .withdraw-funds-btn";
	},
	teardown: function() {
		Testing.restoreMethods(
			Balanced.Adapter.create
		);
	}
});

(function() {
	var setupMarketplaceController = function(bankAccounts) {
		Ember.run(function() {
			var model = Balanced.__container__.lookup('controller:marketplace').get('model');
			model.set('owner_customer', Ember.Object.create({
				debits_uri: '/customers/' + Testing.CUSTOMER_ID + '/debits',
				credits_uri: '/customers/' + Testing.CUSTOMER_ID + '/credits',
				bank_accounts: bankAccounts,
				debitable_bank_accounts: bankAccounts
			}));
		});
	};
	var assertQueryString = function(string, expected, assert) {
		var qsParameters = Balanced.Utils.queryStringToObject(string);
		_.each(expected, function(value, key) {
			assert.deepEqual(qsParameters[key], value, "Query string parameter %@".fmt(key));
		});
	};

	var getResultsUri = function() {
		var controller = Balanced.__container__.lookup("controller:marketplace_transactions");
		return controller.get("resultsLoader.resultsUri");
	};

	test('can visit page', function(assert) {
		visit(Testing.ACTIVITY_ROUTE)
			.checkPageTitle("Transactions", assert)
			.checkElements({
				'.results-actions-bar a:contains(Export)': 1
			}, assert)
			.then(function() {
				var resultsUri = getResultsUri();
				assert.deepEqual(resultsUri.split("?")[0], '/transactions', 'Transactions URI is correct');
				assertQueryString(resultsUri, {
					limit: "50",
					sort: "created_at,desc"
				}, assert);
			});
	});

	test('add funds', function(assert) {
		var spy = sinon.spy(Balanced.Adapter, "create");
		var bankAccounts = Balanced.BankAccount.findAll();

		visit(Testing.ACTIVITY_ROUTE)
			.then(function() {
				setupMarketplaceController(bankAccounts);
			})
			.click(this.ADD_FUNDS_SELECTOR)
			.checkElements({
				"#add-funds:visible": 1,
				'#add-funds select option': 1,
				'#add-funds label.control-label:contains(characters max)': 'Appears on statement as (14 characters max)',
				'#add-funds input[name=appears_on_statement_as][maxlength=14]': 1
			}, assert)
			.fillForm("#add-funds form", {
				"dollar_amount": "55.55",
				"appears_on_statement_as": "BALANCED TEST",
				"description": 'Adding lots of money yo'
			})
			.click("#add-funds [name=modal-submit]")
			.then(function() {
				var fundingInstrumentUri = bankAccounts.objectAt(0).get("uri");
				var call = spy.firstCall;
				assert.ok(spy.calledOnce);
				assert.deepEqual(call.args.slice(0, 3), [Balanced.Debit, fundingInstrumentUri + '/debits', {
					"source_uri": fundingInstrumentUri,
					"amount": "5555",
					"appears_on_statement_as": "BALANCED TEST",
					"description": 'Adding lots of money yo'
				}]);
			});
	});

	test('add funds only adds once despite multiple clicks', function(assert) {
		var stub = sinon.stub(Balanced.Adapter, "create");
		var bankAccounts = Balanced.BankAccount.findAll();

		visit(Testing.ACTIVITY_ROUTE)
			.then(function() {
				setupMarketplaceController(bankAccounts);
			})
			.click(this.ADD_FUNDS_SELECTOR)
			.fillForm("#add-funds", {
				dollar_amount: "55.55",
				appears_on_statement_as: "BALANCED TEST",
				description: 'Adding lots of money yo'
			})
			.clickMultiple('#add-funds .modal-footer button[name=modal-submit]', 4)
			.then(function() {
				assert.ok(stub.calledOnce);
			});
	});

	test('withdraw funds', function(assert) {
		var spy = sinon.spy(Balanced.Adapter, "create");
		var bankAccounts = Balanced.BankAccount.findAll();

		visit(Testing.ACTIVITY_ROUTE)
			.then(function() {
				setupMarketplaceController(bankAccounts);
			})
			.click(this.WITHDRAW_FUNDS_SELECTOR)
			.then(function() {
				assert.equal(
					$('input[name=appears_on_statement_as]:visible').attr('maxlength'),
					'14'
				);
			})
			.checkElements({
				'#withdraw-funds:visible': 1,
				'#withdraw-funds select option': 1,
				'#withdraw-funds label.control-label:contains(characters max)': 'Appears on statement as (14 characters max)'
			}, assert)
			.fillForm("#withdraw-funds form", {
				"dollar_amount": "55.55",
				"appears_on_statement_as": "BALANCED TEST",
				"description": 'Withdrawing some monies'
			})
			.click('#withdraw-funds .modal-footer button[name=modal-submit]')
			.then(function() {
				var args = spy.firstCall.args;
				assert.ok(spy.calledOnce);

				assert.deepEqual(args.slice(0, 3), [Balanced.Credit, bankAccounts.objectAt(0).get("uri") + "/credits", {
					amount: "5555",
					appears_on_statement_as: "BALANCED TEST",
					description: "Withdrawing some monies",
					destination_uri: bankAccounts.objectAt(0).get("uri")
				}]);
			});
	});

	test('withdraw funds only withdraws once despite multiple clicks', function(assert) {
		var stub = sinon.stub(Balanced.Adapter, "create");
		var bankAccounts = Balanced.BankAccount.findAll();

		visit(Testing.ACTIVITY_ROUTE)
			.then(function() {
				setupMarketplaceController(bankAccounts);
			})
			.click(this.WITHDRAW_FUNDS_SELECTOR)
			.fillForm('#withdraw-funds', {
				dollar_amount: "55.55",
				appears_on_statement_as: "Cool test"
			})
			.clickMultiple('#withdraw-funds .modal-footer button[name=modal-submit]', 4)
			.then(function() {
				assert.ok(stub.calledOnce);
			});
	});

	test('download activity', function(assert) {
		var stub;

		visit(Testing.ACTIVITY_ROUTE)
			.then(function() {
				var controller = Balanced.__container__.lookup("controller:marketplace_transactions");
				var loader = controller.get("resultsLoader");
				Ember.run(function() {
					loader.setProperties({
						startTime: moment('2013-08-01T00:00:00.000Z').toDate(),
						endTime: moment('2013-08-01T00:00:00.000Z').toDate()
					});
				});
				stub = sinon.stub(loader, "postCsvExport");
				stub.returns(Ember.RSVP.resolve());
			})
			.click(".results-actions-bar a:contains(Export)")
			.fillForm("#download-csv form", {
				emailAddress: "test@example.com"
			})
			.click("#download-csv [name=modal-submit]")
			.then(function() {
				assert.ok(stub.calledOnce);
				assert.equal(stub.firstCall.args[0], "test@example.com");
			})
			.checkElements({
				"#header .notification-center-message:last": "We're processing your request. We will email you once the exported data is ready to view."
			}, assert);
	});

	test('transactions date sort has different states', function(assert) {
		var objectPath = ".results th.date .sortable";
		var states = [];
		var count = 0;
		var testAmount = 5;

		visit(Testing.ACTIVITY_ROUTE)
			.then(function() {
				assert.ok($(objectPath).is(".descending"), "Search defaults to descending");
			})
			.click(objectPath)
			.then(function() {
				assert.ok($(objectPath).is(".ascending"), "Search is set to ascending");
			});
	});

	test('Filter Activity transactions table by type & status', function(assert) {
		visit(Testing.ACTIVITY_ROUTE)
			.click('#content .results table.transactions th.type .type-filter li a:contains(Holds)')
			.then(function() {
				var resultsUri = getResultsUri();
				assert.deepEqual(resultsUri.split("?")[0], '/transactions', 'Activity Transactions URI is correct');
				assertQueryString(resultsUri, {
					type: "hold",
					'status[in]': 'failed,succeeded,pending',
					limit: "50",
					sort: "created_at,desc"
				}, assert);
			})
			.click('#content table.transactions th.type a:contains(All)')
			.click("#content table.transactions th.status a:contains(Succeeded)")
			.then(function() {
				assertQueryString(getResultsUri(), {
					status: "succeeded",
					limit: "50",
					sort: "created_at,desc"
				}, assert);
			});
	});
})();
