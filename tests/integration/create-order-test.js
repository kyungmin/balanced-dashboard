import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Create Order', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
		Testing.createCard();
	},
	teardown: function() {
		Testing.restoreMethods(
			Adapter.create
		);
		Ember.run(App, "destroy");
	}
});

test('form validation', 2, function() {
	visit(Testing.MARKETPLACE_ROUTE)
		.click('.page-navigation a:contains(Create an order)')
		.checkElements({
			"#charge-card button:contains(Create)": 1
		})
		.click('button:contains(Create)')
		.check("#charge-card .form-group.has-error", 6);
});

test('can charge a card', function() {
	var spy = sinon.spy(Adapter, 'create');

	visit(Testing.MARKETPLACE_ROUTE)
		.click('.page-navigation a:contains(Create an order)')
		.fillForm('#charge-card', {
			name: 'Tarun Chaudhry',
			number: '4111111111111111',
			cvv: '123',
			expiration_date: '12 / 2020',
			postal_code: '95014',
			appears_on_statement_as: 'My Charge',
			debit_description: 'Internal',
			dollar_amount: '12.00'
		})
		.click('button:contains(Create)')
		.then(function() {
			var args = spy.args;
			deepEqual(spy.args[0][1], '/customers', "Create customer call");
			deepEqual(spy.args[1][1].replace(/CU[\w\d]+/g, "CUxxxxxx"), "/customers/CUxxxxxx/orders", "Create order call");
			deepEqual(args.slice(0, 2), [Models.Debit, "/cards/%@/debits".fmt(Testing.CARD_ID)]);
			matchesProperties(args[2][2], {
				amount: "1200",
				appears_on_statement_as: 'My Charge',
				debit_description: 'Internal',
				source_uri: '/cards/' + Testing.CARD_ID
			});
		});
});

