import Ember from "ember";

var GroupedTransactionsTableView = Ember.View.extend({
	layoutName: 'results/dummy-grouped-transactions-table-header',
	tagName: 'table',
	classNames: ["items", "grouped-transactions"],
});

export default GroupedTransactionsTableView;
