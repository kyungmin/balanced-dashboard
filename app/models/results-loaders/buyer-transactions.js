import FilterableTransactionsResultsLoader from "./filterable-transactions";
import ModelArray from "../core/model-array";

var BuyerTransactionsResultsLoader = FilterableTransactionsResultsLoader.extend({
	results: function() {
		var self = this;

		var results = this.get("unfilteredResults").filter(function(transaction) {
			return !self.get("merchantOrderUris").contains(transaction.get("order_uri"));
		});
		return ModelArray.create({
			isLoaded: true,
			content: results
		});
	}.property("unfilteredResults.@each.order_uri", "merchantOrderUris"),

	merchantOrderUris: function() {
		return this.get("ordersResultsLoader.results").mapBy("uri");
	}.property("ordersResultsLoader.results.@each.uri"),

});

export default BuyerTransactionsResultsLoader;
