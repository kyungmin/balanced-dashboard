import ResultsTableView from "./results-table";
import SearchModelArray from "balanced-dashboard/models/core/search-model-array";

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
			var promise = SearchModelArray.newArrayLoadedFromUri(settlement.get("credits_uri"), "credit");
			promise.then(function(credits) {
				var settlementGroup = Ember.Object.create({
					settlement_uri: settlement.get('uri'),
					settlement: settlement,
					orderGroups: self.groupCreditsByOrder(credits)
				});
				groupedTransactions.pushObject(settlementGroup);
			});
		});
		console.log(groupedTransactions)
		return groupedTransactions;
	}.property("loader.results.length"),

	groupCreditsByOrder: function(credits) {
		var groupedCredits = [];
		var Order = this.container.lookupFactory("model:order");

		credits.forEach(function(transaction) {
			var order = Order.find(transaction.get('order_uri'));
			var orderGroup = groupedCredits.findBy('order_uri', transaction.get('order_uri'));

			if (!orderGroup) {
				orderGroup = Ember.Object.create({
					order_uri: transaction.get('order_uri'),
					order: order,
					transactions: []
				});
				groupedCredits.pushObject(orderGroup);
			}
			orderGroup.get('transactions').pushObject(transaction);
		});

		return groupedCredits;
	}
});

export default TransactionsTableGroupedBySettlement;
