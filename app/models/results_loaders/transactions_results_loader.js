Balanced.TransactionsResultsLoader = Balanced.ResultsLoader.extend({
	resultsType: Balanced.Transaction,
	path: Ember.computed.oneWay("marketplace.transactions_uri"),
	typeFilters: undefined, // ["transaction", "credit", "debit", "card_hold", "refund", "reversal"],
	statusFilters: undefined, // ["failed", "succeeded", "pending"],

	status: function() {
		return this.get("statusFilters");
	}.property("statusFilters"),

	queryStringArguments: function() {
		var queryStringBuilder = new Balanced.ResultsLoaderQueryStringBuilder();

		queryStringBuilder.addValues({
			limit: this.get("limit"),
			sort: this.get("sort"),
			offset: 0,

			type: this.get("type"),
			status: this.get("status"),

			"created_at[>]": this.get("startTime"),
			"created_at[<]": this.get("endTime"),
		});

		console.log(queryStringBuilder.getQueryStringAttributes());

		return queryStringBuilder.getQueryStringAttributes();
	}.property("sort", "startTime", "endTime", "type", "status", "limit")
});