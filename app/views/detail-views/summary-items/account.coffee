`import FundingInstrument from "./funding-instrument";`
`import Util from "balanced-dashboard/lib/utils";`

Account = FundingInstrument.extend(
	text: Ember.computed "model.balance", ->
		Util.capitalize(@get("model.type_name"))

	hoverValue: Ember.computed("text", "fundingInstrumentType", ->
		"#{@get("text")} (Balance: #{Util.formatCurrency(@get("model.balance"))})"
	)
)

`export default Account;`
