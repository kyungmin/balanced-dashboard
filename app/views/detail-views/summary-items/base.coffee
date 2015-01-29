`import Ember from "ember";`

BaseSummaryItemView = Ember.View.extend(
	tagName: "dd"
	templateName: "detail-views/summary-items/base"
	classNameBindings: []

	isHasButton: Ember.computed("buttonModal", ->
		!Ember.isBlank(@get("buttonModal"))
	)

	isLoading: Ember.computed.reads("model.isLoading")
	isBlank: Ember.computed("text", ->
		Ember.isBlank @get("text")
	)

	isLink: Ember.computed "routeName", ->
		!Ember.isBlank(@get("routeName"))

	routeName: Ember.computed.reads("model.route_name")
	hoverValue: null

	learnMoreText: null
	isLearnMoreText: Ember.computed "learnMoreText", ->
		!Ember.isBlank(@get("learnMoreText"))

	isShowLearnMoreSection: false

	actions:
		toggleDrawer: ->
			@toggleProperty("isShowLearnMoreSection")
)

`export default BaseSummaryItemView;`
