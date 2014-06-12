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

module('Payments', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createDebits();
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
	return Balanced.__container__.lookup('controller:activity_transactions').get("results_uri");
};

test('can visit page', function(assert) {
	visit(Testing.ACTIVITY_ROUTE)
		.checkElements({
			"#content h1": "Transactions",
			'#activity .download': 1
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
		});
});

test('add funds', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");
	var bankAccounts = Balanced.BankAccount.findAll();

	visit(Testing.ACTIVITY_ROUTE)
		.then(function() {
			setupMarketplaceController(bankAccounts);
		})
		.click('.activity-escrow-box .add-funds-btn')
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
		.click('.activity-escrow-box .add-funds-btn')
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
	var fundingInstrumentUri;

	visit(Testing.ACTIVITY_ROUTE)
		.then(function() {
			setupMarketplaceController(bankAccounts);
		})
		.click('.activity-escrow-box .withdraw-funds-btn')
		.then(function() {
			fundingInstrumentUri = $("#withdraw-funds select[name=destination_uri] option").first().val();
			assert.ok($('#withdraw-funds').is(':visible'), 'withdraw funds modal visible');
			assert.equal($('#withdraw-funds select option').length, 1, 'bank accounts in account dropdown');
			assert.equal(
				$('label.control-label:contains(characters max):visible').text(),
				'Appears on statement as (14 characters max)'
			);
			assert.equal(
				$('input[name=appears_on_statement_as]:visible').attr('maxlength'),
				'14'
			);
		})
		.fillForm("#withdraw-funds form", {
			"destination_uri": fundingInstrumentUri,
			"dollar_amount": "55.55",
			"appears_on_statement_as": "BALANCED TEST",
			"description": 'Withdrawing some monies'
		})
		.click('#withdraw-funds .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Credit, fundingInstrumentUri + '/credits'));
			assert.equal(spy.getCall(0).args[2].amount, 5555);
			assert.equal(spy.getCall(0).args[2].description, 'Withdrawing some monies');
		});
});

test('withdraw funds only withdraws once despite multiple clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");
	var bankAccounts = Balanced.BankAccount.findAll();

	visit(Testing.ACTIVITY_ROUTE)
		.then(function() {
			setupMarketplaceController(bankAccounts);
		})
		.click('.activity-escrow-box .withdraw-funds-btn')
		.fillForm('#withdraw-funds', {
			dollar_amount: "55.55"
		})
		.clickMultiple('#withdraw-funds .modal-footer button[name=modal-submit]', 4)
		.then(function() {
			assert.ok(stub.calledOnce);
		});
});

test('download activity', function(assert) {
	assert.equal($(".alert span").length, 0);
	var stub = sinon.stub(Balanced.Adapter, "create");
	stub.withArgs(Balanced.Download).callsArgWith(3, {
		download: {}
	});

	visit(Testing.ACTIVITY_ROUTE)
		.click("#main #activity .download")
		.fillForm(".download-modal.in form", {
			email: "test@example.com"
		})
		.click('.download-modal.in form .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.Download, '/downloads', {
				email_address: "test@example.com",
				uri: "",
				type: "transactions"
			}));
			assert.equal($(".alert span").length, 1);
			assert.equal($(".alert span").text(), "We're processing your request. We will email you once the exported data is ready to view.");
		});
});

test('download disputes', function(assert) {
	assert.equal($(".alert span").length, 0);
	var stub = sinon.stub(Balanced.Adapter, "create");
	stub.withArgs(Balanced.Download).callsArgWith(3, {
		download: {}
	});

	visit(Testing.ACTIVITY_ROUTE)
		.click("#main #activity a:contains(Disputes)")
		.click("#main #activity .icon-export.download")
		.fillForm(".download-modal.in form", {
			email: "test@example.com"
		})
		.click('.download-modal.in .modal-footer button[name=modal-submit]')
		.then(function() {
			var args = stub.firstCall.args;

			assert.ok(stub.calledOnce, "Called Once");
			assert.deepEqual(args[0], Balanced.Download);
			assert.deepEqual(args[1], "/downloads");
			assert.deepEqual(args[2], {
				email_address: "test@example.com",
				uri: "",
				type: "disputes"
			}, "Called with the right arguments");

			assert.equal($(".alert span").length, 1);
			assert.equal($(".alert span").text(), "We're processing your request. We will email you once the exported data is ready to view.");
		});
});

test('download activity only runs once despite multiple clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.ACTIVITY_ROUTE)
		.click("#main #activity .icon-export.download")
		.fillForm(".download-modal.in form", {
			email: 'test@example.com'
		})
		.clickMultiple('.download-modal.in .modal-footer button[name=modal-submit]', 4)
		.then(function() {
			assert.ok(stub.calledOnce);
			stub.restore();
		});
});

test('transactions date sort has different states', function(assert) {
	var objectPath = "#activity .results th.date .sortable";
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
