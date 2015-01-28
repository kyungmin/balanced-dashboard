import Ember from "ember";
import Computed from "balanced-dashboard/utils/computed";
import GroupedTransactionRowView from "./grouped-transaction-row";
import Utils from "balanced-dashboard/lib/utils";

var GroupedReversalRowView = GroupedTransactionRowView.extend({
	paymentMethodFromText: function() {
		var label = "Loading...";
		var type = "";

		if (this.get("item.credit.destination.last_four")) {
			label = this.get("item.credit.destination.last_four");
			type = Ember.String.dasherize(this.get("item.credit.destination.type_name"));
		} else if (this.get("item.credit.destination.isPayableAccount")){
			label = "Payable account";
			type = "payable-account";
		}

		return Utils.safeFormat('<i class="icon-%@ non-interactive"></i>%@', type, label).htmlSafe();
	}.property("item.credit.destination.type_name", "item.credit.destination.last_four"),

	paymentMethodToText: function() {
		var label = "Loading...";
		var type = "";

		if (this.get("item.order")) {
			label = "Order balance";
			type = "orders";
		} else {
			label = "Marketplace balance";
			type = "escrow";
		}

		return Utils.safeFormat('<i class="icon-%@ non-interactive"></i>%@', type, label).htmlSafe();
	}.property("item.destination.last_four", "dasherizedPaymentMethodType"),

	customerText: Ember.computed.reads("item.customer.display_me"),
	amountText: Ember.computed.reads("item.amount")
});

export default GroupedReversalRowView;
