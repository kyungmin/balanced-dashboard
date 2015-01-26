import TransactionFactory from "./transaction-factory";
import Debit from "../debit";
import Customer from "../customer";

var DebitOrderFactory = TransactionFactory.extend({
	save: function() {
		var self = this;
		var deferred = Ember.RSVP.defer();
		this.validate();

		var getErrorMessage = function(error) {
			return Ember.isBlank(error.additional) ?
				error.description :
				error.additional;
		};

		if (this.get("isValid")) {
			var order;

			this.createOrderWithSeller()
				.then(function(o) {
					order = o;
					return self.getBuyer();
				})
				.then(function(buyer) {
					return self.getSource(buyer);
				})
				.then(function(source) {
					return self.createDebit(source, order);
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
	},

	getSource: function(/* buyer */) {
		Ember.assert("Implement #getSource and make it return a promise with the source", false);
	},

	getBuyer: function() {
		Ember.assert("Implement #getbuyer and make it return a promise with the buyer", false);
	},

	getDebitAttributes: function() {
		var properties = this.getProperties("amount", "appears_on_statement_as");
		properties.description = this.get("debit_description");

		return properties;
	},

	createDebit: function(source, order) {
		var sourceUri = source.get("uri");
		var debitsUri = source.get("debits_uri");
		var buyerUri = source.get("customer_uri");

		var debitAttributes = _.extend({}, this.getDebitAttributes(), {
			customer_uri: buyerUri,
			uri: debitsUri,
			source_uri: sourceUri,
			order_uri: order.get("uri")
		});

		return Debit.create(debitAttributes).save();
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

	createOrderWithSeller: function() {
		var orderDescription = this.get("order_description");
		var seller = Customer.create(this.getSellerCustomerAttributes());

		return seller.save()
			.then(function(seller) {
				var description = orderDescription;
				return seller.createOrder(description);
			});
	},
});

export default DebitOrderFactory;
