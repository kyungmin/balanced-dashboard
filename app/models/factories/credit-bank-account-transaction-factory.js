import Ember from "ember";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";
import CreditOrderFactory from "./credit-order-factory";
import BankAccount from "../bank-account";

/*
 * This factory uses the api feature of creating a Credit without creating a
 * BankAccount object.
 */
var CreditBankAccountTransactionFactory = CreditOrderFactory.extend({
	getDestinationAttributes: function() {
		return this.getProperties("account_number", "name", "routing_number", "account_type");
	},

	getDestination: function(seller) {
		return BankAccount
			.create(this.getDestinationAttributes())
			.tokenizeAndCreate(seller.get("uri"));
	},

	validations: {
		dollar_amount: ValidationHelpers.positiveDollarAmount,
		appears_on_statement_as: ValidationHelpers.bankTransactionAppearsOnStatementAs,

		name: ValidationHelpers.bankAccountName,
		routing_number: ValidationHelpers.bankAccountRoutingNumber,
		account_number: ValidationHelpers.bankAccountNumber,
		account_type: ValidationHelpers.bankAccountType,
		order: {
			presence: true
		}
	}
});

export default CreditBankAccountTransactionFactory;
