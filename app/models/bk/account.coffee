`import Ember from "ember";`
`import BkAccount from "balanced-addon-models/models/account";`
`import Computed from "balanced-dashboard/utils/computed";`
`import BkUtils from "balanced-dashboard/utils/bk-utils";`

Account = BkAccount.extend(
	routeName: "account",
	route_name: "account",
	isPayableAccount: Ember.computed.equal("type", "payable"),
	type_name: (->
		type = @get("type").capitalize()
		"%@ account".fmt(type)
	).property("type"),
	description_with_type: Ember.computed("id", ->
		"Payable account: #{@get("id")}"
	),
	toLegacyModel: BkUtils.generateToLegacyModelMethod("account")
)

`export default Account;`
