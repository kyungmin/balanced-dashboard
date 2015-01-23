import Debit from "../debit";
import Card from "../card";
import Customer from "../customer";
import TransactionFactory from "./transaction-factory";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";

var EXPIRATION_DATE_FORMAT = /^(\d\d) [\/-] (\d\d\d\d)$/;

var DebitCardTransactionFactory = TransactionFactory.extend({
	getDestinationAttributes: function() {
		var attributes = this.getProperties("name", "number", "cvv", "expiration_month", "expiration_year");
		attributes.address = {
			postal_code: this.get("postal_code")
		};
		return attributes;
	},

	getDebitAttributes: function() {
		var attributes = this.getProperties("amount", "appears_on_statement_as");
		attributes.description = this.get("debit_description");
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
			format: EXPIRATION_DATE_FORMAT,
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
	}.property("expiration_date"),

	saveCard: function(buyerUri) {
		return Card
			.create(this.getDestinationAttributes())
			.tokenizeAndCreate(buyerUri);
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

	getSellerCustomerAttributes: function() {
		var email = this.get("seller_email_address");
		if (Ember.isBlank(email)) {
			email = undefined;
		}
		return {
			name: this.get("seller_name"),
			email: email
		};
	},

	save: function() {
		var deferred = Ember.RSVP.defer();
		var self = this;
		var order = undefined;
		var card = undefined;
		this.validate();

		var getErrorMessage = function(error) {
			return Ember.isBlank(error.additional) ?
				error.description :
				error.additional;
		};

		if (this.get("isValid")) {
			var buyer = Customer.create(self.getBuyerCustomerAttributes());


			buyer.save()
				.then(function() {
					return self.saveCard(buyer.get("uri"));
				})
				.then(function(c) {
					card = c;
					var seller = Customer.create(self.getSellerCustomerAttributes());
					return seller.save();
				})
				.then(function(seller) {
					var description = self.get("order_description");
					return seller.createOrder(description);
				})
				.then(function(order) {
					var debitAttributes = _.extend({}, self.getDebitAttributes(), {
						customer_uri: buyer.get("uri"),
						uri: card.get('debits_uri'),
						source_uri: card.get('uri'),
						order_uri: order.get("uri")
					});
					return Debit.create(debitAttributes).save();
				})
				.then(function(debit) {
					deferred.resolve(debit);
				})
				.catch(function(response) {
					response.errors.forEach(function(error) {
						if (error.extras) {
							_.each(error.extras, function(value, key) {
								self.get("validationErrors").add(key, "server", null, value);
							});
						}
						self.get("validationErrors").add(undefined, "server", null, getErrorMessage(error));
					});
					deferred.reject(self);
				});
		} else {
			deferred.reject();
		}

		return deferred.promise;
	}
});

export default DebitCardTransactionFactory;
