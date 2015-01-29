import SummarySectionBase from "./summary-section-base";

var OrderSummarySectionView = SummarySectionBase.extend({
	generateItems: function() {
		var model = this.get("model");
		this.addLabel("Status", "status");
		this.addSummaryItem("order-status", {
			model: model,
		});

		this.addInternalDescriptionLabel();
		this.addSummaryItem("model-description", {
			model: model
		});

		this.addLabel("Merchant", "customers");
		this.addSummaryItem("customer", {
			sectionView: this,
			modelBinding: "sectionView.merchant"
		});
		this.addLabel("Payable account", "payable-account");
		this.addSummaryItem("funding-instrument", {
			summaryView: this,
			modelBinding: "summaryView.account"
		});
	},

	merchant: Ember.computed.reads("model.seller"),
	account: Ember.computed.reads("merchant.account")
});

export default OrderSummarySectionView;
