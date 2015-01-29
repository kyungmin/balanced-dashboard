import BaseSummarySection from "./summary-section-base";
import Utils from "balanced-dashboard/lib/utils";

var SettlementSummarySectionView = BaseSummarySection.extend({
	generateItems: function() {
		var model = this.get("model");

		this.addLabel("Status", "status");
		this.addSummaryItem("settlement-status", {
			model: model
		});

		this.addInternalDescriptionLabel();
		this.addSummaryItem("model-description", {
			model: model
		});

		this.addLabel("Merchant", "customers");
		this.addSummaryItem("customer", {
			sectionView: this,
			modelBinding: "sectionView.model.destination.customer"
		});

		this.addFundingInstrumentLabel("Source", "model.source");
		this.addSummaryItem("funding-instrument", {
			modelBinding: "summaryView.model.source",
			summaryView: this,
		});

		this.addFundingInstrumentLabel("Destination", "model.destination");
		this.addSummaryItem("funding-instrument", {
			modelBinding: "summaryView.model.destination",
			summaryView: this,
		});
	},
});

export default SettlementSummarySectionView;
