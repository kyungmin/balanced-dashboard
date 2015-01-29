`import Ember from "ember";`

SummarySectionResourceList = Ember.ContainerView.extend(
	tagName: "dl"
	classNames: ["linked-resources"]

	addItem: (viewName, attributes) ->
		view = @createChildView(viewName, attributes)
		@pushObject view
		view

	addFundingInstrumentLabel: (labelPrefix, modelBinding, summaryView) ->
		@addItem("detail-views/summary-labels/funding-instrument-label",
			prefixText: labelPrefix
			summaryView: summaryView
			modelBinding: "summaryView.#{modelBinding}"
		)

	addLabel: (labelText, labelIcon) ->
		if Ember.typeOf(labelIcon) == "string"
			attributes =
				icon: labelIcon
		else
			attributes = labelIcon
		attributes.text = labelText
		@addItem("detail-views/summary-labels/label-base", attributes)
)

`export default SummarySectionResourceList;`
