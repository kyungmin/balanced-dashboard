import TransactionsResultsLoader from "./transactions";
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
		})
	}.property("unfilteredResults.@each.id", "settledTransactionIds"),

	// TODO: populate settled transaction IDs
	settledTransactionIds: function() {
		var self = this;
		var settlements = this.get("settlementsResultsLoader.results");
		var settledTransactions = [];

		settlements.forEach(function(settlement) {
			var credits = TransactionsResultsLoader.create({
				path: settlement.get("credits_uri")
			}).get("results.content");
			settledTransactions.pushObject(credits);
		});

		return _.flatten(settledTransactions);
	}.property("settlementsResultsLoader.results.length")
});

export default UnsettledTransactionsResultsLoader;
