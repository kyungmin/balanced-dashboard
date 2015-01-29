`import Ember from "ember";`
`import Model from "./core/model";`
`import Computed from "balanced-dashboard/utils/computed";`
`import Constants from "balanced-dashboard/utils/constants";`

Account = Model.extend(
	routeName: "account"
	route_name: "account"
	isPayableAccount: Ember.computed.equal("type", "payable")
	appears_on_statement_max_length: Constants.MAXLENGTH.APPEARS_ON_STATEMENT_BANK_ACCOUNT,

	type_name: Ember.computed "type", ->
		type = @get("type")

		if type
			"#{type.capitalize()} account"
		else
			"account"

	description_with_type: Ember.computed "id", ->
		"Payable account: #{@get("id")}"
)

`export default Account;`
