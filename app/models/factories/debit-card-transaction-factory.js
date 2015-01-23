import Debit from "../debit";
import Card from "../card";
import Customer from "../customer";
import TransactionFactory from "./transaction-factory";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";

var DebitCardTransactionFactory = TransactionFactory.extend({
	getDestinationAttributes: function() {
		var attributes = this.getProperties("name", "number", "cvv", "expiration_month", "expiration_year");
		attributes.address = {
			postal_code: this.get("postal_code")
		};
		return attributes;
	},

	getDebitAttributes: function() {
		return this.getProperties("amount", "appears_on_statement_as", "debit_description");
	},

	validations: {
		dollar_amount: ValidationHelpers.positiveDollarAmount,
		appears_on_statement_as: ValidationHelpers.cardTransactionAppearsOnStatementAs,

		name: ValidationHelpers.cardName,
		number: ValidationHelpers.cardNumber,
		cvv: ValidationHelpers.cardCvv,
		expiration_date: ValidationHelpers.cardExpirationDate,
	},

	save: function() {
		var deferred = Ember.RSVP.defer();

		var baseDebitAttributes = this.getDebitAttributes();
		var self = this;
		this.validate();

		if (this.get("isValid")) {
			var buyer = Customer.create({
				name: self.get("buyer_name"),
				email: self.get("buyer_email_address")
			});
			var card;

			buyer.save()
				.then(function() {
					return Card
						.create(self.getDestinationAttributes())
						.tokenizeAndCreate(buyer.get("uri"));
				})
				.then(function(c) {
					card = c;
					var seller = Customer.create({
						name: self.get("seller_name"),
						email: self.get("seller_email_address")
					});
					return seller.save();
				})
				.then(function(seller) {
					var description = self.get("order_description");
					return seller.createOrder(description);
				})
				.then(function(order) {
					var debitAttributes = _.extend({}, baseDebitAttributes, {
						customer_uri: buyer.get("uri"),
						uri: card.get('debits_uri'),
						source_uri: card.get('uri'),
						order_uri: order.get("uri")
					});
					return Debit.create(debitAttributes).save();
				})
				.then(function(model) {
					deferred.resolve(model);
				}, function(response) {
					if (response.message) {
						self.get("validationErrors").add(undefined, "server", null, response.message);
					} else if (response.errors) {
						response.errors.forEach(function(error) {
							self.get("validationErrors").add(undefined, "server", null, error.description);
						});
					}
					deferred.reject(self);
				});
		} else {
			deferred.reject();
		}

		return deferred.promise;
	}
});

export default DebitCardTransactionFactory;
