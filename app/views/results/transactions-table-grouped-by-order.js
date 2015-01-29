import TransactionsTableView from "./transactions-table";

var TransactionsTableGroupedByOrderView = TransactionsTableView.extend({
	layoutName: 'results/grouped-transactions-table-layout',
	templateName: 'results/transactions-table-grouped-by-order',
	classNames: 'non-interactive',

	colspan: function() {
		return (this.get("hideCustomerColumn")) ? "4": "5";
	}.property("hideCustomerColumn"),

	groupedResults: function() {
		var results = this.get("loader.results");

		var groupedTransactions = [];
		var Order = this.container.lookupFactory("model:order");

		results.forEach(function(transaction) {
			if (!_.contains(["Hold", "Refund", "Reversal"], transaction.get("type_name"))) {
				// TODO: Figure out a way to include manually created holds
				var orderUri = transaction.get('order_uri');
				var order = orderUri ? Order.find(orderUri) : null;
				var orderGroup = groupedTransactions.findBy('order_uri', transaction.get('order_uri'));

				if (!orderGroup) {
					orderGroup = Ember.Object.create({
						order_uri: orderUri,
						order: order,
						transactions: []
					});
					groupedTransactions.pushObject(orderGroup);
				}
				orderGroup.get('transactions').pushObject(transaction);
			}
		});

		if (groupedTransactions.length === 0 && results.total > 0) {
			results.loadNextPage();
		}

		this.set("parentView.totalOrders", groupedTransactions.length);

		return groupedTransactions;
	}.property("loader.results.length"),

	actions: {
		changeTypeFilter: function(type) {
			if (type === "transaction") {
				type = null;
			}
			this.set("loader.type", type);
		},
		changeStatusFilter: function(status) {
			this.get("loader").setStatusFilter(status);
		},
	}
});

export default TransactionsTableGroupedByOrderView;
