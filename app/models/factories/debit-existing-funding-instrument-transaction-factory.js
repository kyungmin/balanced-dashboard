import DebitOrderFactory from "./debit-order-factory";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";

var DebitExistingFundingInstrumentTransactionFactory = DebitOrderFactory.extend({
	appears_on_statement_max_length: Ember.computed.oneWay("source.appears_on_statement_max_length"),

	getBuyer: function() {
		return Ember.RSVP.resolve(this.get("source.customer"));
	},

	getSource: function() {
		return Ember.RSVP.resolve(this.get("source"));
	},

	validations: {
		dollar_amount: ValidationHelpers.positiveDollarAmount,
		appears_on_statement_as: ValidationHelpers.cardTransactionAppearsOnStatementAs,
		source: {
			presence: true
		}
	}
});

export default DebitExistingFundingInstrumentTransactionFactory;
