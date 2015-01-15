import Ember from "ember";
import Computed from "balanced-dashboard/utils/computed";
import LinkedTwoLinesCellView from "../tables/cells/linked-two-lines-cell";
import Utils from "balanced-dashboard/lib/utils";

var GroupedTransactionRowView = LinkedTwoLinesCellView.extend({
	tagName: 'tr',
	templateName: 'results/grouped-transaction-row',
	routeName: Computed.orProperties("item.route_name", "item.routeName"),
	spanClassNames: Ember.computed.reads("item.status"),
	typeName: Ember.computed.reads("item.type_name"),

	title: function() {
		if (_.contains(this.get("classNames"), "current")) {
			return 'You are currently viewing this transaction.';
		}

		return this.get("primaryLabelText");
	}.property("primaryLabelText"),

	primaryLabelText: function() {
		if (_.contains(this.get("classNames"), "current")) {
			return '%@ (currently viewing)'.fmt(this.get('typeName'));
		}
		var transactionText;
		var description = this.get('item.description');
		var status = Utils.capitalize(this.get('item.status'));

		if (description) {
			transactionText = '%@ (%@)'.fmt(this.get('typeName'), description);
		} else {
			transactionText = this.get('typeName');
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
		var typeName = this.get('typeName');

		if (typeName === "Order") {
			var label = '<span class="primary">%@</span><span class="secondary">Merchant</span>';
			var primaryLabel = this.get("item.seller.display_me");

			return Utils.safeFormat(label, primaryLabel).htmlSafe();
		} else if (typeName === "Settlement") {
			return this.get("settlementCustomerText");
		} else {
			return this.get("item.customer.display_me");
		}
	}.property("item.seller.display_me", "item.customer.display_me", "settlementCustomerText"),

	settlementCustomerText: function() {
		var label = '<span class="primary">%@</span><span class="secondary">%@</span>';
		var primaryLabel = this.get("customer.display_me");
		var secondaryLabel = this.get("customer.email_address");

		return Utils.safeFormat(label, primaryLabel, secondaryLabel).htmlSafe();
	}.property("customer.display_me", "customer.email_address"),

	paymentMethodText: function() {
		if (this.get('typeName') === "Settlement") {
			return this.get("settlementPaymentMethodText");
		}
		var label = '<span class="primary">%@</span><span class="secondary">%@</span>';
		return Utils.safeFormat(label, this.get('paymentMethodPrimaryLabelText')).htmlSafe();
	}.property('paymentMethodPrimaryLabelText', "settlementPaymentMethodText", "typeName"),

	settlementPaymentMethodText: function() {
		var bankAccount = this.get('bankAccount');
		var label = '<span class="primary">%@</span><span class="secondary">%@</span>';
		var primaryLabel = "%@ %@".fmt(bankAccount.get("last_four"), bankAccount.get("brand"));
		var secondaryLabel = bankAccount.get("funding_instrument_type");
		return Utils.safeFormat(label, primaryLabel, secondaryLabel).htmlSafe();
	}.property("bankAccount.last_four", "bankAccount.brand", "bankAccount.funding_instrument_type"),

	dasherizedPaymentMethodType: Ember.computed.reads("item.dasherized_funding_instrument_type"),

	paymentMethodPrimaryLabelText: function() {
		var label = "";
		var dasherizedPaymentMethodType = this.get("dasherizedPaymentMethodType");

		if (this.get("item.destination.type") === "payable") {
			label = "Payable account";
		} else if (this.get("item.source")) {
			label = this.get("item.source.last_four");
		} else {
			label = this.get("item.destination.last_four");
		}
		return Utils.safeFormat('<i class="icon-%@ non-interactive"></i>%@', dasherizedPaymentMethodType, label).htmlSafe();
	}.property("item.source.last_four", "item.destination.last_four", "dasherizedPaymentMethodType"),

	amountText: function() {
		if (this.get("typeName") === "Order") {
			var label = '<span class="primary">%@</span><span class="secondary">Order balance</span>';
			var primaryLabel = Utils.formatCurrency(this.get("item.amount_escrowed"));
			return Utils.safeFormat(label, primaryLabel).htmlSafe();
		} else {
			return Utils.formatCurrency(this.get("item.amount"));
		}
	}.property("item.amount", "typeName")
});

export default GroupedTransactionRowView;
