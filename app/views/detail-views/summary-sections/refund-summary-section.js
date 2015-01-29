import SummarySectionBase from "./transaction-base-summary-section";

var RefundSummarySectionView = SummarySectionBase.extend({
	generateItems: function() {
		var model = this.get("model");
		this.addLabel("Status", "status");
		this.addSummaryItem("refund-status", {
			model: model,
		});

		this.addInternalDescriptionLabel();
		this.addSummaryItem("model-description", {
			model: model
		});

		this.addLabel("Customer", "customers");
		this.addSummaryItem("customer", {
			sectionView: this,
			modelBinding: "sectionView.debit.customer"
		});

		this.addFundingInstrumentLabel("Source", "model.debit.source")
		this.addSummaryItem("funding-instrument", {
			summaryView: this,
			modelBinding: "summaryView.model.debit.source"
		});
	},
});

export default RefundSummarySectionView;
