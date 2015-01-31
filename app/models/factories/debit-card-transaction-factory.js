import DebitOrderFactory from "./debit-order-factory";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";
import Customer from "../customer";
import Card from "../card";
import Constants from "balanced-dashboard/utils/constants";

var DebitCardTransactionFactory = DebitOrderFactory.extend({
	getSourceAttributes: function() {
		var attributes = this.getProperties("name", "number", "cvv", "expiration_month", "expiration_year");
		attributes.address = {
			postal_code: this.get("postal_code")
		};
		return attributes;
	},

	validations: {
		dollar_amount: ValidationHelpers.positiveDollarAmount,
		appears_on_statement_as: ValidationHelpers.cardTransactionAppearsOnStatementAs,

		name: ValidationHelpers.cardName,
		number: ValidationHelpers.cardNumber,
		cvv: ValidationHelpers.cardCvv,
		expiration_date: {
			presence: true,
			format: Constants.EXPIRATION_DATE_FORMAT,
			expired: {
				validator: function(object, attrName, value) {
					var date = object.getExpirationDate();
					if (Ember.isBlank(date)) {
						object.get("validationErrors").add(attrName, "expired", null, "" + value + " is not a valid card expiration date");
					}
					else if (date < new Date()) {
						object.get("validationErrors").add(attrName, "expired", null, "is expired");
					}
				}
			}
		}
	},

	getSource: function(buyer) {
		return Card
			.create(this.getSourceAttributes())
			.tokenizeAndCreate(buyer.get("uri"));
	},

	getBuyerCustomerAttributes: function() {
		var email = this.get("buyer_email_address");
		if (Ember.isBlank(email)) {
			email = undefined;
		}
		return {
			name: this.get("buyer_name"),
			email: email
		};
	},

	getBuyer: function() {
		var customer = this.get("customer");

		if (customer) {
			return customer;
		} else {
			return Customer.create(this.getBuyerCustomerAttributes()).save();
		}
	},

	getExpirationDate: function() {
		var match = this.getExpirationDateMatch();
		if (match) {
			var month = parseInt(match[0]);
			if (0 < month && month <= 12) {
				return moment(match[0], "MM / YYYY").endOf("month").toDate();
			}
		}
	},

	getExpirationDateMatch: function() {
		var expirationDate = this.get("expiration_date");
		if (!Ember.isBlank(expirationDate)) {
			return expirationDate.match(EXPIRATION_DATE_FORMAT);
		}
	},

	expiration_month: function() {
		var match = this.getExpirationDateMatch();
		if (match) {
			return match[1];
		}
	}.property("expiration_date"),

	expiration_year: function() {
		var match = this.getExpirationDateMatch();
		if (match) {
			return match[2];
		}
	}.property("expiration_date")
});

export default DebitCardTransactionFactory;
