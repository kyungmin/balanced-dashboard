import SummarySectionBase from "./summary-section-base";

var CustomerSummarySectionView = SummarySectionBase.extend({
	generateItems: function() {
		var model = this.get("model");
		this.addLabel("Status", "status");
		this.addSummaryItem("customer-status", {
			model: model,
		});

		this.addLabel("Payable account", "payable-account");
		this.addSummaryItem("account", {
			modelBinding: "summaryView.model.account",
			summaryView: this
		});
	},
});

export default CustomerSummarySectionView;
