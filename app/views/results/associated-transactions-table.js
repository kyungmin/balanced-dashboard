import TransactionsTableView from "./transactions-table";

var AssociatedTransactionsTableView = TransactionsTableView.extend({
	templateName: "results/associated-transactions-table",
	classNames: ["non-interactive"],
	colspan: 4,
	embedded: true
});

export default AssociatedTransactionsTableView;
