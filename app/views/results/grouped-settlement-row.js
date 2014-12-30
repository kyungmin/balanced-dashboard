import Ember from "ember";
import Computed from "balanced-dashboard/utils/computed";
import LinkedTwoLinesCellView from "../tables/cells/linked-two-lines-cell";
import Utils from "balanced-dashboard/lib/utils";

var GroupedSettlementRowView = LinkedTwoLinesCellView.extend({
	tagName: 'tr',
	templateName: 'results/grouped-settlement-row',
	routeName: Ember.computed.oneWay("item.route_name"),
	spanClassNames: Ember.computed.oneWay("item.status"),

	bankAccount: function() {
		var BankAccount = this.container.lookupFactory("model:bank-account");
		return BankAccount.find(this.get("item.destination_uri"));
	}.property("item.destination_uri"),

	title: function() {
		var description = this.get("item.description");

		if (description) {
			return description;
		}
		if (_.contains(this.get("classNames"), "current")) {
			return 'You are currently viewing this transaction.';
		}
		return '(Created at %@)'.fmt(this.get("secondaryLabelText"));
	}.property("item.description", "primaryLabelText", "secondaryLabelText"),

	primaryLabelText: function() {
		if (_.contains(this.get("classNames"), "current")) {
			return '%@ (currently viewing)'.fmt(this.get('item.type_name'));
		}
		var transactionText;
		var description = this.get('item.description');
		var status = Utils.capitalize(this.get('item.status'));

		if (status) {
			status = status.toLowerCase();
		}

		if (description) {
			transactionText = '%@ (%@) %@'.fmt(this.get('item.type_name'), description, status);
		} else {
			transactionText = '%@ %@'.fmt(this.get('item.type_name'), status);
		}

		if (this.get('item.type_name') === 'Dispute') {
			transactionText = '%@ %@'.fmt(this.get('item.type_name'), status);
		}

		return Utils.safeFormat(transactionText).htmlSafe();
	}.property('classNames', 'item.type_name', 'item.status', 'item.description'),

	secondaryLabelText: function () {
		return Utils.humanReadableDateTime(this.get('item.created_at'));
	}.property('item.created_at'),

	customerText: function() {
		var Customer = this.container.lookupFactory("model:customer");
		this.get("bankAccount").then(function(bankAccount) {
			var customer = Customer.find(bankAccount.get("customer_uri"));
			var label = '<span class="primary">%@</span><span class="secondary">%@</span>';
			var primaryLabel = customer.get("display_me");
			var secondaryLabel = customer.get("email_address");

			return Utils.safeFormat(label, primaryLabel, secondaryLabel).htmlSafe();
		});
	}.property("bankAccount", "bankAccount.customer", "bankAccount.customer.display_me", "bankAccount.customer.email_address"),

	paymentMethodText: function() {
		var bankAccount = this.get('bankAccount');
		var label = '<span class="primary">%@</span><span class="secondary">%@</span>';
		var primaryLabel = "%@ %@".fmt(bankAccount.get("last_four"), bankAccount.get("brand"));
		var secondaryLabel = bankAccount.get("funding_instrument_type");
		return Utils.safeFormat(label, primaryLabel, secondaryLabel).htmlSafe();
	}.property("bankAccount.last_four", "bankAccount.brand", "bankAccount.funding_instrument_type"),

	amountText: function() {
		return Utils.formatCurrency(this.get("item.amount"));
	}.property("item.amount")
});

export default GroupedSettlementRowView;
