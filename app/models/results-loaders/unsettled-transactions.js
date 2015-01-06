import TransactionsResultsLoader from "./transactions";
import ModelArray from "../core/model-array";
import SearchModelArray from "../core/search-model-array";

var UnsettledTransactionsResultsLoader = TransactionsResultsLoader.extend({
	unfilteredResults: function() {
		var uri = this.get('resultsUri');
		var type = this.get('resultsType');

		if (Ember.isBlank(uri)) {
			return ModelArray.create({
				isLoaded: true
			});
		} else {
			var searchArray = SearchModelArray.newArrayLoadedFromUri(uri, type);
			searchArray.setProperties({
				sortProperties: [this.get('sortField') || 'created_at'],
				sortAscending: this.get('sortDirection') === 'asc'
			});

			return searchArray;
		}
	}.property("resultsUri", "resultsType", "sortField", "sortDirection"),

	results: function() {
		var self = this;

		return this.get("unfilteredResults").filter(function(credit) {
			return !self.get("settledTransactionIds").contains(credit.get("id"));
		});
	}.property("unfilteredResults.@each.id", "settledTransactionIds"),

	settledTransactionIds: function() {
		return this.get("settledTransactions").mapBy("id");
	}.property("settledTransactions.@each.id"),

	settledTransactions: function() {
		var self = this;
		var settlements = this.get("settlementsResultsLoader.results");
		var settledTransactions = [];

		settlements.forEach(function(settlement) {
			var promise = SearchModelArray.newArrayLoadedFromUri(settlement.get("credits_uri"), "credit");
			promise.then(function(credits) {
				settledTransactions.pushObjects(credits.content);
			});
		});
		return settledTransactions;
	}.property("settlementsResultsLoader.results.length")
});

export default UnsettledTransactionsResultsLoader;
