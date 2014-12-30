import ResultsTableView from "./results-table";

var TransactionsTableGroupedBySettlement = ResultsTableView.extend({
	templateName: 'results/transactions-table-grouped-by-settlement',
	classNames: ['settlements', 'non-interactive'],

	colspan: function() {
		return (this.get("embedded")) ? "3": "4";
	}.property("embedded"),

	groupedResults: function() {
		var self = this;
		var settlements = this.get("loader.results");
		var groupedTransactions = [];

		settlements.forEach(function(settlement) {
			var credits = self.container.lookupFactory("results-loader:transactions").create({
				path: settlement.get("credits_uri")
			}).get("results.content");

			var settlementGroup = Ember.Object.create({
				settlement_uri: settlement.get('uri'),
				settlement: settlement,
				transactions: credits
			});
			groupedTransactions.pushObject(settlementGroup);
		});

		return groupedTransactions;
	}.property("loader.results.length"),

});

export default TransactionsTableGroupedBySettlement;
