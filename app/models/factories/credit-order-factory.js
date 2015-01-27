import TransactionFactory from "./transaction-factory";
import Credit from "../credit";

var CreditOrderFactory = TransactionFactory.extend({
	save: function() {
		var self = this;
		var order = this.get("order");
		var seller = this.get("order.seller");

		var deferred = Ember.RSVP.defer();
		this.validate();

		var getErrorMessage = function(error) {
			return Ember.isBlank(error.additional) ?
				error.description :
				error.additional;
		};

		if (this.get("isValid")) {
			self.getDestination(seller)
				.then(function(destination) {
					return self.createCredit(destination, order);
				})
				.then(function(credit) {
					deferred.resolve(credit);
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

	getDestination: function(/* seller */) {
		Ember.assert("Implement #getDestination and make it return a promise with the destination", false);
	},

	getCreditAttributes: function() {
		var properties = this.getProperties("amount", "appears_on_statement_as");
		properties.description = this.get("credit_description");

		return properties;
	},

	createCredit: function(destination, order) {
		var destinationUri = destination.get("uri");
		var creditsUri = destination.get("credits_uri");

		var creditAttributes = _.extend({}, this.getCreditAttributes(), {
			uri: creditsUri,
			destination_uri: destinationUri,
			order_uri: order.get("uri")
		});

		return Credit.create(creditAttributes).save();
	}
});

export default CreditOrderFactory;
