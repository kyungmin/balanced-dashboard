`import Base from "./base";`
`import Utils from "balanced-dashboard/lib/utils";`

Account = Base.extend(
	hoverValue: Ember.computed.reads("model.description_with_type")
	routeName: Ember.computed.reads("model.routeName")
	text: Ember.computed "model.balance", ->
		amount = @get("model.balance")
		"Balance: $#{Utils.centsToDollars(amount)}"
)

`export default Account;`
