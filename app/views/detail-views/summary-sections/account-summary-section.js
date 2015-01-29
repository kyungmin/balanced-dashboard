import SummarySectionView from "./summary-section-base";

var AccountSummarySectionView = SummarySectionView.extend({
	generateItems: function() {
		var model = this.get("model");
		this.addLabel("Customer", "customers");
		this.addSummaryItem("customer", {
			modelBinding: "fundingInstrument.customer",
			fundingInstrument: model
		});
	},
});

export default AccountSummarySectionView;
