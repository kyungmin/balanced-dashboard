module('Bank Account Page', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createBankAccount();
	},
	teardown: function() {
		Testing.restoreMethods(
			Balanced.Adapter.create
		);
	}
});

var setBankAccountProperties = function(properties) {
	Ember.run(function() {
		Balanced.__container__.lookup('controller:bankAccounts')
			.get('model').setProperties(properties);
	});
};

test('can view bank account page', function(assert) {
	visit(Testing.BANK_ACCOUNT_ROUTE)
		.checkElements({
			"#content h1": "Bank account",
			".title span": "1234 Wells Fargo Bank"
		}, assert);
});

test('credit bank account', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.BANK_ACCOUNT_ROUTE)
		.click(".main-header .buttons a.credit-button")
		.then(function() {
			// opened the modal
			assert.equal(
				$('label.control-label:contains(characters max):visible').text(),
				'Appears on statement as (14 characters max)'
			);
			assert.equal(
				$('input[name="appears_on_statement_as"]:visible').attr('maxlength'),
				'14'
			);
		})
		.fillIn('#credit-funding-instrument .modal-body input[name="dollar_amount"]', '1000')
		.fillIn('#credit-funding-instrument .modal-body input[name="description"]', 'Test credit')
		.click('#credit-funding-instrument .modal-footer button[name="modal-submit"]')
		.then(function() {
			// should be one create for the debit
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.Credit, '/bank_accounts/' + Testing.BANK_ACCOUNT_ID + '/credits', sinon.match({
				amount: 100000,
				description: "Test credit"
			})));
		});
});

test('crediting only submits once despite multiple clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.BANK_ACCOUNT_ROUTE)
		.click(".main-header .buttons a.credit-button")
		.fillIn('#credit-funding-instrument .modal-body input[name="dollar_amount"]', '1000')
		.fillIn('#credit-funding-instrument .modal-body input[name="description"]', 'Test credit')
		.click('#credit-funding-instrument .modal-footer button[name="modal-submit"]')
		.click('#credit-funding-instrument .modal-footer button[name="modal-submit"]')
		.click('#credit-funding-instrument .modal-footer button[name="modal-submit"]')
		.click('#credit-funding-instrument .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
		});
});

test('debit bank account', 4, function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.BANK_ACCOUNT_ROUTE)
		.then(function() {
			setBankAccountProperties({
				can_debit: true
			});
		})
		.click(".main-header .buttons a.debit-button")
		.then(function() {
			// opened the modal
			assert.equal(
				$('label.control-label:contains(characters max):visible').text(),
				'Appears on statement as (14 characters max)'
			);
			assert.equal(
				$('input[name="appears_on_statement_as"]:visible').attr('maxlength'),
				'14'
			);
		})
		.fillForm("#debit-funding-instrument", {
			dollar_amount: '1000',
			description: 'Test debit'
		})
		.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.Debit, '/bank_accounts/' + Testing.BANK_ACCOUNT_ID + '/debits', sinon.match({
				amount: 100000,
				description: "Test debit"
			})));
		});
});

test('debiting only submits once despite multiple clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.BANK_ACCOUNT_ROUTE)
		.then(function() {
			setBankAccountProperties({
				can_debit: true
			});
		})
		.click(".main-header .buttons a.debit-button")
		.fillForm("#debit-funding-instrument", {
			dollar_amount: '1000',
			description: 'Test debit'
		})
		.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
		.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
		.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
		.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
		});
});

test('can initiate bank account verification', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.BANK_ACCOUNT_ROUTE)
		.then(function() {
			setBankAccountProperties({
				can_debit: false,
				customer: true,
				verification: false
			});
		})
		.then(function() {
			assert.deepEqual($("#content h1").text().trim(), "Bank account");
			assert.deepEqual($(".main-header .buttons a.verify-button").length, 1);
		})
		.click(".main-header .buttons a.verify-button")
		.then(function() {
			assert.equal($('#verify-bank-account').css('display'), 'block', 'verify bank account modal visible');
		})
		.click('#verify-bank-account .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.Verification, '/bank_accounts/' + Testing.BANK_ACCOUNT_ID + '/verifications'));
		});
});

test('can confirm bank account verification', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.BANK_ACCOUNT_ROUTE)
		.then(function() {
			setBankAccountProperties({
				can_debit: false,
				verification: Balanced.Verification.create({
					uri: '/bank_accounts/' + Testing.BANK_ACCOUNT_ID + '/bank_account_verifications',
					verification_status: 'pending',
					attempts_remaining: 1
				})
			});
		})
		.then(function() {
			assert.equal($('#content h1').text().trim(), 'Bank account');
			assert.equal($(".main-header .buttons a.confirm-verification-button").length, 1, 'has confirm button');
		})
		.click(".main-header .buttons a.confirm-verification-button")
		.then(function() {
			assert.equal($('#confirm-verification').css('display'), 'block', 'confirm verification modal visible');
		})
		.fillForm("#confirm-verification", {
			amount_1: "1.00",
			amount_2: "1.00"
		})
		.click('#confirm-verification .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.Verification, '/bank_accounts/' + Testing.BANK_ACCOUNT_ID + '/bank_account_verifications'));
			assert.ok(stub.getCall(0).args[2].amount_1, "1.00");
			assert.ok(stub.getCall(0).args[2].amount_2, "1.00");
		});
});

test('renders metadata correctly', function(assert) {
	var metaData = {
		'key': 'value',
		'other-keey': 'other-vaalue'
	};
	Ember.run(function() {
		Balanced.BankAccount.findAll().then(function(accounts) {
			var account = accounts.content[0];
			account.set('meta', metaData);

			account.save().then(function(account) {
				var accountPageUrl = '/marketplaces/' + Testing.MARKETPLACE_ID + '/bank_accounts/' + account.get('id');
				visit(accountPageUrl).then(function() {
					var $dl = $('.bank-account-info .dl-horizontal');
					$.each(metaData, function(key, value) {
						assert.equal($dl.find('dt:contains("' + key + '")').length, 1);
						assert.equal($dl.find('dd:contains("' + value + '")').length, 1);
					});
				});
			});
		});
	});
});
