import Ember from "ember";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";
import Utils from "balanced-dashboard/lib/utils";
import CreditOrderFactory from "./credit-order-factory";

var CreditExistingFundingInstrumentTransactionFactory = CreditOrderFactory.extend({
	appears_on_statement_max_length: Ember.computed.oneWay("destination.appears_on_statement_max_length"),

	getDestination: function() {
		return Ember.RSVP.resolve(this.get("destination"));
	},

	isAmountOverMaximum: function() {
		if (this.get("order")) {
			return this.get("amount") > this.get("order.amount_escrowed");
		}
		return false;
	},

	validations: {
		dollar_amount: {
			format: {
				validator: function(object, attribute, value) {
					var message = function(message) {
						object.get("validationErrors").add(attribute, "format", null, message);
					};

					value = (value || "").toString().trim();
					if (Ember.isBlank(value)) {
						message("is required");
					} else if (object.isAmountOverMaximum()) {
						var maxAmount = object.get("order.amount_escrowed");
						message("cannot be more than %@".fmt(Utils.formatCurrency(maxAmount)));
					} else if (!object.isAmountPositive()) {
						message("must be a positive number");
					} else {
						try {
							var v = Utils.dollarsToCents(value);
							if (isNaN(v) || v <= 0) {
								message("must be a positive number");
							}
						} catch (e) {
							message(e.message.replace("Error: ", ""));
						}
					}
				}
			}
		},
		appears_on_statement_as: ValidationHelpers.bankTransactionAppearsOnStatementAs,
		destination: {
			presence: true
		}
	}
});

export default CreditExistingFundingInstrumentTransactionFactory;
