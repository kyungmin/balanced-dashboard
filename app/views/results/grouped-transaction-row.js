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
	connected: true,

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

	paymentMethodFromText: function() {
		var label = "";
		var type = "";
		var typeName = this.get('typeName');

		if (typeName === "Debit" || typeName === "Hold") {
			label = this.get("item.source.last_four");
			type = this.get("dasherizedPaymentMethodType");
		}
		if (typeName === "Credit" || typeName === "Refund") {
			label = "Order balance";
			type = "orders";
		}
		if (typeName === "Reversal") {
			if (this.get("item.credit.destination.last_four")) {
				label = this.get("item.credit.destination.last_four");
				type = Ember.String.dasherize(this.get("item.credit.destination.type_name"));
			} else {
				label = "Payable account";
				type = "payable-account";
			}
		}
		if (typeName === "Settlement") {
			if (this.get("settlementSource.last_four")) {
				label = this.get("settlementSource.last_four");
				type = Ember.String.dasherize(this.get("settlementSource.type_name"));
			} else if (this.get("settlementSource.type") === "payable") {
				label = "Payable account";
				type = "payable-account";
			}
		}
		return Utils.safeFormat('<i class="icon-%@ non-interactive"></i>%@', type, label).htmlSafe();
	}.property("typeName", "item.source.last_four", "item.source.type_name", "dasherizedPaymentMethodType", "item.credit.destination.last_four", "item.credit.destination.type_name", "settlementSource.last_four", "settlementSource.type_name", "settlementSource.type"),

	paymentMethodToText: function() {
		var label = "";
		var type = "";
		var typeName = this.get('typeName');
		if (typeName === "Debit" || typeName === "Hold") {
			label = "Order balance";
			type = "orders";
		}
		if (typeName === "Credit") {
			if (this.get("item.destination.last_four")) {
				label = this.get("item.destination.last_four");
				type = this.get("dasherizedPaymentMethodType");
			} else {
				label = "Payable account";
				type = "payable-account";
			}
		}
		if (typeName === "Refund") {
			label = this.get("item.debit.source.last_four");
			if (this.get("item.debit.source")) {
				type = Ember.String.dasherize(this.get("item.debit.source.type_name"));
			}
		}
		if (typeName === "Reversal") {
			label = "Order balance";
			type = "orders";
		}
		if (typeName === "Settlement") {
			if (this.get("settlementDestination.last_four")) {
				label = this.get("settlementDestination.last_four");
				type = Ember.String.dasherize(this.get("settlementDestination.type_name"));
			} else if (this.get("settlementDestination.type") === "payable") {
				label = "Payable account";
				type = "payable-account";
			}
		}
		return Utils.safeFormat('<i class="icon-%@ non-interactive"></i>%@', type, label).htmlSafe();
	}.property("typeName", "item.destination.last_four", "item.destination.type_name", "dasherizedPaymentMethodType", "item.debit.source.last_four", "item.debit.source.type_name", "settlementDestination.last_four", "settlementDestination.type_name", "settlementDestination.type"),

	settlementSource: function(attr) {
		var self = this;
		var store = this.container.lookup("controller:marketplace").get("store");
		store.fetchItem("account", this.get("item.source_uri")).then(function(source) {
			self.set(attr, source.toLegacyModel());
		});
		return null;
	}.property("item.source_uri"),

	settlementDestination: function(attr) {
		var self = this;
		var store = this.container.lookup("controller:marketplace").get("store");
		store.fetchItem("account", this.get("item.destination_uri")).then(function(destination) {
			self.set(attr, destination.toLegacyModel());
		});
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

	dasherizedPaymentMethodType: Ember.computed.reads("item.dasherized_funding_instrument_type"),

	amountText: function() {
		if (this.get("typeName") === "Order") {
			if (["account", "settlement", "marketplace.settlements"].contains(this.container.lookup("controller:application").get('currentRouteName'))) {
				return null;
			}

			var label = '<span class="primary">%@</span><span class="secondary">Order balance</span>';
			var primaryLabel = Utils.formatCurrency(this.get("item.amount_escrowed"));
			return Utils.safeFormat(label, primaryLabel).htmlSafe();
		} else {
			return Utils.formatCurrency(this.get("item.amount"));
		}
	}.property("item.amount", "typeName", "item.amount_escrowed")
});

export default GroupedTransactionRowView;
