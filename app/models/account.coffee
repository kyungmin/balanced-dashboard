`import Ember from "ember";`
`import Model from "./core/model";`
`import Computed from "balanced-dashboard/utils/computed";`

Account = Model.extend(
	routeName: "account",
	isPayableAccount: Ember.computed.equal("type", "payable"),
	type_name: (->
		type = @get("type").capitalize()
		"%@ account".fmt(type)
	).property("type")
)

`export default Account;`
