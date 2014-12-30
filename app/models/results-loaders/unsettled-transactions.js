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
	settledTransactionIds: []
});

export default UnsettledTransactionsResultsLoader;
