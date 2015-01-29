`import Base from "./base";`

FundingInstrument = Base.extend(
	isCard: Ember.computed.reads("model.isCard")
	isBankAccount: Ember.computed.reads("model.isBankAccount")
	isPayableAccount: Ember.computed.reads("model.isPayableAccount")

	fundingInstrumentType: Ember.computed "isCard", "isBankAccount", "isPayableAccount", ->
		if @get("isCard")
			"card"
		else if @get("isBankAccount")
			"bank-account"
		else if @get("isPayableAccount")
			"payable-account"

	isLoading: Ember.computed.reads("model.isLoading")
	isLink: true
	isBlank: Ember.computed.empty("model")

	text: Ember.computed "fundingInstrumentType", "model.description", "model.id", ->
		switch @get("fundingInstrumentType")
			when "payable-account"
				@get("model.id")
			else
				@get("model.description")

	hoverValue: Ember.computed("text", "fundingInstrumentType", ->
		"#{@get("text")} (#{@get("model.type_name")})"
	)

	lastFour: Ember.computed.reads("model.last_four")
	company: Ember.computed "isCard", "model.brand", "model.formatted_bank_name", ->
		if @get("isCard")
			return @get("model.brand")
		else
			return @get("model.formatted_bank_name")
)

`export default FundingInstrument;`
