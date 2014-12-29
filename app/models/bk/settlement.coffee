`import Ember from "ember";`
`import Utils from "balanced-dashboard/lib/utils";`
`import BkSettlement from "balanced-addon-models/models/settlement";`

Settlement = BkSettlement.extend(
	routeName: "settlement",
	type_name: "Settlement",
	amountInDollars: (->
		"$%@".fmt(Utils.centsToDollars(@get("amount")))
	).property("amount")
)

`export default Settlement;`
