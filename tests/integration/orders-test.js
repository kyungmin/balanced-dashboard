import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Utils from "balanced-dashboard/lib/utils";
import Models from "../helpers/models";

var App, Adapter;

module('Integration - Order Page', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();

		andThen(function() {
			return Testing.createOrder();
		});
	},
	teardown: function() {
		Ember.run(App, 'destroy');
	}
});

var getResultsUri = function() {
	var controller = BalancedApp.__container__.lookup("controller:marketplace/orders");
	return controller.get("resultsLoader.resultsUri");
};

var assertQueryString = function(string, expected) {
	var qsParameters = Utils.queryStringToObject(string);
	_.each(expected, function(value, key) {
		deepEqual(qsParameters[key], value, "Query string parameter %@".fmt(key));
	});
};

test("can visit orders page", function() {
	visit(Testing.MARKETPLACE_ROUTE)
		.checkPageTitle("Orders")
		.then(function() {
			var resultsUri = BalancedApp.__container__.lookup('controller:marketplace/orders').get("resultsLoader.resultsUri");
			deepEqual(resultsUri.split("?")[0], "/transactions");

			assertQueryString(resultsUri, {
				limit: "20",
			});
		});
});

test('Filter orders table by type & status', function() {
	visit(Testing.MARKETPLACE_ROUTE)
		.click('#content .results table.transactions th:first-of-type li a:contains(Holds)')
		.then(function() {
			var resultsUri = getResultsUri();
			deepEqual(resultsUri.split("?")[0], '/transactions', 'Activity Transactions URI is correct');
			assertQueryString(resultsUri, {
				type: "hold",
				'status[in]': 'failed,succeeded,pending',
				limit: "50",
				sort: "created_at,desc"
			});
		})
		.click('#content table.transactions th:first-of-type a:contains(All)')
		.click("#content table.transactions th.status a:contains(Succeeded)")
		.then(function() {
			assertQueryString(getResultsUri(), {
				status: "succeeded",
				limit: "50",
				sort: "created_at,desc"
			});
		});
});

test('can visit order page', function() {
	visit(Testing.ORDER_ROUTE)
		.checkPageType("Order")
		.checkPageTitle("#123");
});

test('displays order balance and tabs', function() {
	visit(Testing.ORDER_ROUTE)
		.checkElements({
			".side-panel .balance": 1,
			".main-panel .nav-tabs li": 2
		});
});

test('displays correct number of charges and payouts per customer', function() {
	visit(Testing.ORDER_ROUTE)
		.checkElements({
			".customer-group": 2,
			".grouped-transactions-container": 2,
			".grouped-transactions-container .grouped-transactions": 3,
			".grouped-transactions-container .grouped-transactions tr": 8
		});
});
