import TransactionsTableView from "./transactions-table";

var TransactionsTableGroupedByOrderView = TransactionsTableView.extend({
	templateName: 'results/transactions-table-grouped-by-order',
	classNames: 'non-interactive',

	colspan: function() {
		return (this.get("embedded")) ? "3": "4";
	}.property("embedded"),

	groupedResults: function() {
		var results = this.get("loader.results");
		var groupedTransactions = [];
		var Order = this.container.lookupFactory("model:order");

		results.forEach(function(transaction) {
			var order = Order.find(transaction.get('order_uri'));
			var orderGroup = groupedTransactions.findBy('order_uri', transaction.get('order_uri'));

			if (!orderGroup) {
				orderGroup = Ember.Object.create({
					order_uri: transaction.get('order_uri'),
					order: order,
					transactions: []
				});
				groupedTransactions.pushObject(orderGroup);
			}
			orderGroup.get('transactions').pushObject(transaction);
		});

		return groupedTransactions;
	}.property("loader.results.length", "view.parentView.controller.settlementsResultsLoader.results"),
});

export default TransactionsTableGroupedByOrderView;
