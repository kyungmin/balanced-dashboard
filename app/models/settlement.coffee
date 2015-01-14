`import Ember from "ember";`
`import Utils from "balanced-dashboard/lib/utils";`
`import Model from "./core/model";`

Settlement = Model.extend(
	routeName: "settlement",
	type_name: "Settlement",
	amountInDollars: (->
		"$%@".fmt(Utils.centsToDollars(@get("amount")))
	).property("amount")
)

`export default Settlement;`
