import Ember from "ember";
import Computed from "balanced-dashboard/utils/computed";
import LinkedTwoLinesCellView from "../tables/cells/linked-two-lines-cell";
import Utils from "balanced-dashboard/lib/utils";

var GroupedTransactionRowView = LinkedTwoLinesCellView.extend({
	tagName: 'tr',
	templateName: 'results/grouped-transaction-row',
	routeName: Computed.orProperties("item.route_name", "item.routeName"),
	spanClassNames: Ember.computed.reads("item.status"),

	title: function() {
		if (_.contains(this.get("classNames"), "current")) {
			return 'You are currently viewing this transaction.';
		}

		return this.get("primaryLabelText");
	}.property("primaryLabelText"),

	primaryLabelText: function() {
		if (_.contains(this.get("classNames"), "current")) {
			return '%@ (currently viewing)'.fmt(this.get('item.type_name'));
		}
		var transactionText;
		var description = this.get('item.description');
		var status = Utils.capitalize(this.get('item.status'));

		if (description) {
			transactionText = '%@ (%@)'.fmt(this.get('item.type_name'), description);
		} else {
			transactionText = this.get('item.type_name');
		}

		if (status) {
			transactionText = '%@ %@'.fmt(transactionText, status.toLowerCase());
		}

		return transactionText;
	}.property('classNames', 'item.status', 'item.description'),

	secondaryLabelText: function () {
		return Utils.humanReadableDateTime(this.get('item.created_at'));
	}.property('item.created_at'),

	bankAccount: function() {
		var BankAccount = this.container.lookupFactory("model:bank-account");
		return BankAccount.find(this.get("item.destination_uri"));
	}.property("item.destination_uri"),

	customer: Ember.computed.reads("bankAccount.customer"),

	customerText: function() {
		if (this.get('item.type_name') === "Settlement") {
			return this.get("settlementCustomerText");
		} else {
			return this.get("item.customer.display_me");
		}
	}.property("item.customer.display_me", "settlementCustomerText"),

	settlementCustomerText: function() {
		var label = '<span class="primary">%@</span><span class="secondary">%@</span>';
		var primaryLabel = this.get("customer.display_me");
		var secondaryLabel = this.get("customer.email_address");

		return Utils.safeFormat(label, primaryLabel, secondaryLabel).htmlSafe();
	}.property("customer.display_me", "customer.email_address"),

	paymentMethodText: function() {
		if (this.get('item.type_name') === "Settlement") {
			return this.get("settlementPaymentMethodText");
		}
		var label = '<span class="primary">%@</span><span class="secondary">%@</span>';
		var secondaryLabel = this.get('paymentMethodSecondaryLabelText') || '';
		return Utils.safeFormat(label, this.get('paymentMethodPrimaryLabelText'), secondaryLabel).htmlSafe();
	}.property('paymentMethodPrimaryLabelText', 'paymentMethodSecondaryLabelText', "settlementPaymentMethodText", "item.type_name"),

	settlementPaymentMethodText: function() {
		var bankAccount = this.get('bankAccount');
		var label = '<span class="primary">%@</span><span class="secondary">%@</span>';
		var primaryLabel = "%@ %@".fmt(bankAccount.get("last_four"), bankAccount.get("brand"));
		var secondaryLabel = bankAccount.get("funding_instrument_type");
		return Utils.safeFormat(label, primaryLabel, secondaryLabel).htmlSafe();
	}.property("bankAccount.last_four", "bankAccount.brand", "bankAccount.funding_instrument_type"),

	paymentMethodPrimaryLabelText: function() {
		if (this.get("item.destination.type") === "payable") {
			return this.get("item.destination.id");
		} else {
			return "%@ %@".fmt(this.get("item.destination.last_four"), this.get("item.destination.brand"));
		}

	}.property("item.destination.id", "item.destination.last_four", "item.destination.brand"),

	paymentMethodSecondaryLabelText: function() {
		if (this.get("item.destination.type") === "payable") {
			return "Payable account";
		} else {
			return this.get('item.destination.funding_instrument_type');
		}

	}.property('item.destination.funding_instrument_type'),

	amountText: function() {
		var amount = this.get("item.amount");
		if (this.get("item.type_name") === "Order") {
			amount = this.get("item.amount_escrowed");
		}
		return Utils.formatCurrency(amount);
	}.property("item.amount", "item.type_name")
});

export default GroupedTransactionRowView;
