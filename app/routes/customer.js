import ModelRoute from "./model";
import Customer from "../models/customer";
import LegacyResultsLoaderWrapper from "balanced-dashboard/utils/legacy-results-loader-wrapper";

var CustomerRoute = ModelRoute.extend({
	title: 'Customer',
	modelObject: Customer,
	marketplaceUri: 'customers_uri',
	setupController: function(controller, customer) {
		this._super(controller, customer);

		var store = this.getStore();
		store.fetchCollection("account", customer.get("accounts_uri"), { limit: 10 }).then(function(collection) {
			var wrapper = LegacyResultsLoaderWrapper.create({collection: collection});
			controller.set("accountsResultsLoader", wrapper);
		});

		var ordersResultsLoader = customer.getOrdersLoader({
			limit: 10
		});

		controller.set("ordersResultsLoader", ordersResultsLoader);

		controller.setProperties({
			fundingInstrumentsResultsLoader: customer.getFundingInstrumentsLoader({
				limit: 10
			}),
			disputesResultsLoader: customer.getDisputesLoader({
				limit: 10
			}),
			transactionsResultsLoader: customer.getTransactionsLoader({
				limit: 10,
				status: ['pending', 'succeeded', 'failed']
			}),
			buyerTransactionsResultsLoader: customer.getBuyerTransactionsLoader({
				limit: 10,
				status: ['pending', 'succeeded', 'failed'],
				ordersResultsLoader: ordersResultsLoader
			}),
			merchantTransactionsResultsLoader: customer.getMerchantTransactionsLoader({
				limit: 10,
				status: ['pending', 'succeeded', 'failed'],
				ordersResultsLoader: ordersResultsLoader
			})
		});
	}
});

export default CustomerRoute;
