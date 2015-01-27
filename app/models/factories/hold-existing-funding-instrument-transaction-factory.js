import TransactionFactory from "./transaction-factory";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";
import Hold from "../hold";
import Customer from "../customer";

var HoldExistingFundingInstrumentTransactionFactory = TransactionFactory.extend({
	validations: {
		dollar_amount: ValidationHelpers.positiveDollarAmount
	},

	save: function() {
		var self = this;
		var order;
		var deferred = Ember.RSVP.defer();
		this.validate();

		var getErrorMessage = function(error) {
			return Ember.isBlank(error.additional) ?
				error.description :
				error.additional;
		};

		if (this.get("isValid")) {
			this.createOrderWithSeller()
				.then(function(o) {
					order = o;
					var source = self.get("source");
					return self.attachCustomerToSource(source);
				})
				.then(function(source) {
					return self.createHold(source, order);
				})
				.then(function(debit) {
					deferred.resolve(debit);
				})
				.catch(function(response) {
					console.log(response)
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

	attachCustomerToSource: function(source) {
		var customer = this.get("customer");

		if (customer) {
			return Ember.RSVP.resolve(source);
		} else {
			var customer = Customer.create(this.getBuyerCustomerAttributes()).save();
			source.set('links.customer', customer.get("id"));
			return source.save();
		}
	},

	getHoldAttributes: function() {
		var properties = this.getProperties("amount", "description");
		return properties;
	},

	createHold: function(source, order) {
		var sourceUri = source.get("uri");
		var holdsUri = source.get("card_holds_uri");
		var buyerUri = source.get("customer_uri");

		var holdAttributes = _.extend({}, this.getHoldAttributes(), {
			customer_uri: buyerUri,
			uri: holdsUri,
			source_uri: sourceUri,
			order_uri: order.get("uri")
		});

		return Hold.create(holdAttributes).save();
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

export default HoldExistingFundingInstrumentTransactionFactory;
