`import LabelBase from "./label-base";`

View = LabelBase.extend(
	isCard: Ember.computed.reads("model.isCard")
	isBankAccount: Ember.computed.reads("model.isBankAccount")
	isPayableAccount: Ember.computed.reads("model.isPayableAccount")
	readableCardType: Ember.computed.reads("model.type_name")

	fundingInstrumentType: Ember.computed "isCard", "isBankAccount", "isPayableAccount", ->
		if @get("isCard")
			"card"
		else if @get("isBankAccount")
			"bank-account"
		else if @get("isPayableAccount")
			"payable-account"

	icon: Ember.computed("fundingInstrumentType", ->
		@get("fundingInstrumentType") || "bank-account"
	)

	text: Ember.computed "model", "fundingInstrumentType", "prefixText", ->
		prefixText = @get("prefixText") || ""
		switch @get("fundingInstrumentType")
			when "card"
				"#{prefixText}: Card"
			when "bank-account"
				"#{prefixText}: Bank account"
			when "payable-account"
				"#{prefixText}: Payable account"
			else
				"#{prefixText}: Funding instrument"
)

`export default View;`
