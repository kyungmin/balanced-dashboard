import TransactionsTableView from "./transactions-table";

var EmbeddedTransactionsTableView = TransactionsTableView.extend({
	templateName: "results/embedded-transactions-table",
	classNames: ["non-interactive"],
	filteredResults: function() {
		var results = this.get("loader.results");
		var filteredResults = [];

		results.forEach(function(transaction) {
			if (!_.contains(["Hold", "Refund", "Reversal"], transaction.get("type_name"))) {
				filteredResults.pushObject(transaction);
			}
		});

		return filteredResults;
	}.property("loader.results.length"),
});

export default EmbeddedTransactionsTableView;
