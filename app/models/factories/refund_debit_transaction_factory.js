require("./transaction_factory");

Balanced.RefundDebitTransactionFactory = Balanced.TransactionFactory.extend({
	isAmountOverMaximum: function() {
		return this.get("amount") > this.get("debit.refund_amount");
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
						var maxAmount = object.get("debit.refund_amount");
						message("cannot be more than %@".fmt(Balanced.Utils.formatCurrency(maxAmount)));
					} else if (!object.isAmountPositive()) {
						message("must be a positive number");
					} else {
						try {
							var v = Balanced.Utils.dollarsToCents(value);
							if (isNaN(v) || v <= 0) {
								message("must be a positive number");
							}
						} catch (e) {
							message(e.message.replace("Error: ", ""));
						}
					}
				}
			}
		}
	},

	maxAmountDollars: Ember.computed.oneWay("debit.max_refund_amount_dollars"),

	dollar_amount: function() {
		return this.get("maxAmountDollars");
	}.property(),

	save: function() {
		this.validate();
		var debit = this.get("debit");
		if (this.get("isValid")) {
			return Balanced.Refund.create({
				uri: debit.get('refunds_uri'),
				debit_uri: debit.get('uri'),
				amount: this.get("amount")
			}).save().then(function(refund) {
				return refund;
			});
		} else {
			return Ember.RSVP.reject();
		}
	}
});
