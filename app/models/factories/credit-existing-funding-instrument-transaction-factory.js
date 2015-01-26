import Ember from "ember";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";
import CreditOrderFactory from "./credit-order-factory";

var CreditExistingFundingInstrumentTransactionFactory = CreditOrderFactory.extend({
	appears_on_statement_max_length: Ember.computed.oneWay("destination.appears_on_statement_max_length"),

	getDestination: function() {
		return Ember.RSVP.resolve(this.get("destination"));
	},

	validations: {
		dollar_amount: ValidationHelpers.positiveDollarAmount,
		appears_on_statement_as: ValidationHelpers.bankTransactionAppearsOnStatementAs,
		destination: {
			presence: true
		},
		order: {
			presence: true
		},
	}
});

export default CreditExistingFundingInstrumentTransactionFactory;
