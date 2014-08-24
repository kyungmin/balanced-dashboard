module('Guest', {
	setup: function() {
		Testing.setupMarketplace();
	},
	teardown: function() {}
});

test('visiting start creates a marketplace', function(assert) {
	visit('/start')
		.then(function() {
			var session = Balanced.__container__.lookup("controller:sessions");

			assert.deepEqual(session.getProperties("isUserGuest", "isUserPresent"), {
				isUserPresent: true,
				isUserGuest: true
			});
		});
});

test('viewing settings page as guest, can view api secret key', function(assert) {
	visit('/marketplaces/' + Testing.MARKETPLACE_ID)
		.click('#marketplace-nav i.icon-my-marketplace')
		.click('#marketplace-nav a:contains(Settings)')
		.click('.create-api-key-btn')
		.then(function() {
			var shown_api_secret_key = $('.api-key-secret').text().trim();

			assert.ok(shown_api_secret_key, sinon.match(/^ak\-test/), 'shown api secret in settings for guest');
		});
});

test('claim account creates a login', function(assert) {
	var stub;

	var emailAddress = 'marshall@example.com',
		password = 'SupahSecret123~!';

	visit('/claim')
		.checkElements({
			"#account-create h2": "Create an account"
		}, assert)
		.fillForm("#account-create", {
			email_address: emailAddress,
			password: password,
			passwordConfirm: password
		})
		.then(function() {
			stub = sinon.stub(jQuery, "ajax");
			stub.returns(Ember.RSVP.resolve({
				uri: "",
			}));
		})
		.click('#account-create [name=modal-submit]')
		.then(function() {
			assert.deepEqual(stub.args[0][0].data, {
				"email_address": "marshall@example.com",
				"password": "SupahSecret123~!",
				"passwordConfirm": "SupahSecret123~!"
			});
			stub.restore();
		});
});
