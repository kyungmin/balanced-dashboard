`import Ember from "ember";`
`import BkAccount from "balanced-addon-models/models/account";`
`import Computed from "balanced-dashboard/utils/computed";`

Account = BkAccount.extend(
	routeName: "account",
	isPayableAccount: Ember.computed.equal("type", "payable"),
	type_name: (->
		type = @get("type").capitalize()
		"%@ account".fmt(type)
	).property("type")
)

`export default Account;`
