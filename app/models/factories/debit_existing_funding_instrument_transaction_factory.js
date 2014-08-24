var ValidationHelpers = Balanced.ValidationHelpers;

Balanced.DebitExistingFundingInstrumentTransactionFactory = Balanced.TransactionFactory.extend({
	appears_on_statement_max_length: Ember.computed.oneWay("source.appears_on_statement_max_length"),
	source_uri: Ember.computed.readOnly("source.uri"),
	getDebitAttributes: function() {
		var properties = this.getProperties("amount", "appears_on_statement_as", "description", "source_uri");
		properties.uri = this.get("source.debits_uri");
		return properties;
	},

	validations: {
		dollar_amount: ValidationHelpers.positiveDollarAmount,
		appears_on_statement_as: ValidationHelpers.cardTransactionAppearsOnStatementAs,
	},

	save: function() {
		var deferred = Ember.RSVP.defer();

		var baseDebitAttributes = this.getDebitAttributes();
		this.validate();
		if (this.get("isValid")) {
			Balanced.Debit.create(this.getDebitAttributes())
				.save()
				.then(function(model) {
					deferred.resolve(model);
				}, function() {
					deferred.reject();
				});
		} else {
			deferred.reject();
		}

		return deferred.promise;
	}
});
