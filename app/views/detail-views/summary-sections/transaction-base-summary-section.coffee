`import Ember from "ember";`
`import SummarySectionBaseView from "./summary-section-base";`

TransactionBaseSummarySection = SummarySectionBaseView.extend(
	generateItems: ->
		model = @get("model")
		@addLabel("Status", "status")
		@addSummaryItem("transaction-status", model: model)

		@addInternalDescriptionLabel()
		@addSummaryItem("model-description", model: model)
		@addLabel "Customer", "customers"
		@addSummaryItem("customer", modelBinding: "transaction.customer", transaction: model)

		if @get("isSource")
			labelPrefix = "From"
		else
			labelPrefix = "To"
		@addFundingInstrumentLabel(labelPrefix, "fundingInstrument")

		@addSummaryItem("funding-instrument",
			summaryView: @
			modelBinding: "summaryView.fundingInstrument"
		)

	isSource: false
	fundingInstrument: Ember.computed.reads("model.destination")
)

`export default TransactionBaseSummarySection;`
