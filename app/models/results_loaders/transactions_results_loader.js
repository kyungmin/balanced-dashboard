require("app/model/transaction");

var VALID_STATUSES = ["failed", "succeeded", "pending"];

Balanced.TransactionsResultsLoader = Balanced.ResultsLoader.extend({
	resultsType: Balanced.Transaction,
	typeFilters: undefined, // ["transaction", "credit", "debit", "card_hold", "refund", "reversal"],

	setStatusFilter: function(value) {
		if (!VALID_STATUSES.contains(value)) {
			value = VALID_STATUSES;
		}
		this.set("status", value);
	},

	status: VALID_STATUSES,

	queryStringArguments: function() {
		var queryStringBuilder = new Balanced.ResultsLoaderQueryStringBuilder();

		queryStringBuilder.addValues({
			limit: this.get("limit"),
			sort: this.get("sort"),
			type: this.get("type"),
			status: this.get("status"),

			"created_at[>]": this.get("startTime"),
			"created_at[<]": this.get("endTime"),
		});

		return queryStringBuilder.getQueryStringAttributes();
	}.property("sort", "startTime", "endTime", "type", "status", "limit")
});
