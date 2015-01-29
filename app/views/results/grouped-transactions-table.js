import Ember from "ember";

var GroupedTransactionsTableView = Ember.View.extend({
	layoutName: 'results/grouped-transactions-inner-table-layout',
	tagName: 'table',
	classNames: ["items", "grouped-transactions"],
});

export default GroupedTransactionsTableView;
