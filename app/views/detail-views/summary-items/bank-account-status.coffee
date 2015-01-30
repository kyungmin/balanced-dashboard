`import BaseStatus from "./base-status";`
`import Utils from "balanced-dashboard/lib/utils";`

BankAccountStatus = BaseStatus.extend(

	verificationRestartDate: Ember.computed("model.verification.updated_at", ->
		updatedAtDate = @get("model.verification.updated_at")
		return moment(new Date(updatedAtDate)).add(3, "days").toDate()
	)

	buttonModal: Ember.computed("isCanStartVerification", "isCanConfirmVerification", ->
		container = this.get("container");
		if (this.get("isCanStartVerification"))
			return container.lookupFactory("view:modals/verify-bank-account-modal")
		else if (this.get("isCanConfirmVerification"))
			return container.lookupFactory("view:modals/bank-account-verification-confirm-modal")

		undefined
	),

	isCanStartVerification: Ember.computed("model.status", "verificationRestartDate", ->
		status = this.get("model.status");
		(status == "unverified") || (status == "failed" && this.get("verificationRestartDate") < new Date())
	),

	isCanConfirmVerification: Ember.computed.equal("model.status", "pending"),

	buttonModalText: Ember.computed "isCanStartVerification", "isCanConfirmVerification", ->
		if (this.get("isCanStartVerification") || this.get("isCanConfirmVerification"))
			return "Verify"
		undefined

	description: Ember.computed("model.status", "formattedVerificationDate", ->
		switch @get("model.status")
			when "pending"
				'Two deposits have been made to your bank account. Confirm verification by entering the amounts.'
			when "unverified"
				'You may only credit to this bank account. You must verify this bank account to debit from it.'
			when "unverifiable"
				 'You may only credit to this bank account. This bank account is unverifiable because it\'s not associated with a customer.'
			when "failed"
				"We could not verify your bank account. You may restart the verification process after #{@get("formattedVerificationDate")}"
			else
				null
	)

	formattedVerificationDate: Ember.computed("verificationRestartDate", ->
		Utils.humanReadableDate @get("verificationRestartDate")
	)

	buttonModalArgument: Ember.computed.reads("model")
)

`export default BankAccountStatus;`
