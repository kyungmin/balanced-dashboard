`import Ember from "ember";`
`import Model from "./core/model";`
`import Computed from "balanced-dashboard/utils/computed";`

Account = Model.extend(
	routeName: "account",
	route_name: "account",
	isPayableAccount: Ember.computed.equal("type", "payable"),
	type_name: (->
		type = @get("type").capitalize()
		"%@ account".fmt(type)
	).property("type"),
	description_with_type: Ember.computed("id", ->
		"Payable account: #{@get("id")}"
	)
)

`export default Account;`
