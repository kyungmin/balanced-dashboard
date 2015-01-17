import TransactionsTableView from "./transactions-table";

var TransactionsTableGroupedByCustomerView = TransactionsTableView.extend({
	templateName: 'results/transactions-table-grouped-by-customer',
	classNames: 'non-interactive',

	colspan: 4,
	hideFromColumn: Ember.computed.equal("paymentMethodText", "To"),
	hideToColumn: Ember.computed.equal("paymentMethodText", "From"),

	customersArray: function() {
		var customers = this.get("customers");
		if (!Ember.isArray(customers)) {
			return [customers];
		}
		return customers;
	}.property("customers"),

	groupedResults: function() {
		var customers = this.get("customersArray");
		var results = this.get("loader.results");
		var groupedTransactions = [];

		results.forEach(function(transaction) {
			var buyer = customers.findBy("uri", transaction.get('customer_uri'));
			var customer = groupedTransactions.findBy('customer_uri', transaction.get('customer_uri'));

			if(!customer) {
				customer = Ember.Object.create({
					customer_uri: transaction.get('customer_uri'),
					customer: buyer,
					transactions: []
				});
				groupedTransactions.pushObject(customer);
			}

			customer.get('transactions').pushObject(transaction);
		});

		return groupedTransactions;
	}.property("customersArray", "loader.results.length"),
});

export default TransactionsTableGroupedByCustomerView;
