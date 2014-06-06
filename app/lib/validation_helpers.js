var formatValidator = function(callback) {
	return {
		validator: function(object, attribute, value) {
			value = (value || "").trim();
			callback(object, attribute, value, function(messages) {
				messages = _.isArray(messages) ? messages : [messages];

				messages.forEach(function(message) {
					object.get("validationErrors").add(attribute, "format", null, message);
				});
			});
		}
	};
};

Balanced.ValidationHelpers = Ember.Namespace.create({
	positiveDollarAmount: {
		presence: true,
		format: formatValidator(function(object, attribute, value, cb) {
			try {
				var v = Balanced.Utils.dollarsToCents(value);
				if (isNaN(v) || v <= 0) {
					cb("must be a positive number");
				}
			} catch (e) {
				cb(e.message.replace("Error: ", ""));
			}
		})
	},
	transactionAppearsOnStatementAs: {
		presence: true,
		format: formatValidator(function(object, attribute, value, cb) {
			var maxLength = object.get("appears_on_statement_max_length");
			var messages = [];
			if (maxLength < value.length) {
				messages.push("must be under %@ characters".fmt(maxLength + 1));
			}

			var invalidCharacters = Balanced.Transaction.findAppearsOnStatementAsInvalidCharacters(value);
			if (invalidCharacters.length === 1) {
				messages.push('"%@" is an invalid character'.fmt(invalidCharacters));
			} else if (invalidCharacters.length > 1) {
				messages.push('"%@" are invalid characters'.fmt(invalidCharacters));
			}
			cb(messages);
		})
	},

	cardName: {
		presence: true
	},
	cardNumber: {
		presence: true,
		format: {
			validator: function(object, attribute, value) {
				if (!balanced.card.isCardNumberValid(value)) {
					object.get('validationErrors').add(attribute, 'blank', null, 'is not valid');
				}
			}
		}
	},
	cardCvv: {
		presence: true,
		numericality: true,
		length: {
			minimum: 3,
			maximum: 4
		}
	},
	cardExpirationDate: {
		format: {
			validator: function(object, attribute, value) {
				var month = object.get("expiration_month");
				var year = object.get("expiration_year");
				if (Ember.isEmpty(month)) {
					object.get("validationErrors").add("expiration_date", "date", null, "month is required");
				}
				if (Ember.isEmpty(year)) {
					object.get("validationErrors").add("expiration_date", "date", null, "year is required");
				}
				if (month && year && (moment("" + month + "/" + year, "MM/YYYY").toDate() < (new Date()))) {
					object.get("validationErrors").add("expiration_date", "date", null, "card is expired");
				}
			}
		}
	},
	cardZipCode: {},

	bankAccountType: {
		presence: true,
		format: formatValidator(function(object, attribute, value, cb) {
			var validStrings = Balanced.BankAccount.ACCOUNT_TYPES.map(function(str) {
				return str.toLowerCase();
			});
			value = value.toLowerCase();
			if (validStrings.indexOf(value) < 0) {
				cb("%@ is not a valid bank account type".fmt(value));
			}
		})
	},
	bankAccountName: {
		presence: true
	},
	bankAccountNumber: {
		presence: true
	},
	bankAccountRoutingNumber: {
		presence: true,
		format: formatValidator(function(object, attribute, value, cb) {
			value = value.toLowerCase();
			if (!balanced.bankAccount.validateRoutingNumber(value)) {
				cb("%@ is not a valid bank routing number".fmt(value));
			}
		})
	},
});
