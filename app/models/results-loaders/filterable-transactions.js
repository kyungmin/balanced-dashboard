import TransactionsResultsLoader from "./transactions";
import ModelArray from "../core/model-array";
import SearchModelArray from "../core/search-model-array";

var FilterableTransactionsResultsLoader = TransactionsResultsLoader.extend({
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
				sortAscending: this.get('sortDirection') === 'asc',
				isLoaded: true
			});

			return searchArray;
		}
	}.property("resultsUri", "resultsType", "sortField", "sortDirection"),

	results: function() {
		Ember.assert("Implement #results and make it return a ModelArray", false);
	}.property()
});

export default FilterableTransactionsResultsLoader;
