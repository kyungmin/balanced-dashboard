require('app/models/mixins/meta_array');

var Computed = {
	isStatus: function(status) {
		return Ember.computed.equal('status', status);
	}
};

Balanced.Transaction = Balanced.Model.extend(
	Balanced.MetaArrayMixin, {
		customer: Balanced.Model.belongsTo('customer', 'Balanced.Customer'),
		events: Balanced.Model.hasMany('events', 'Balanced.Event'),

		amount_dollars: function() {
			if (this.get('amount')) {
				return (this.get('amount') / 100).toFixed(2);
			} else {
				return '';
			}
		}.property('amount'),

		// Note: Returning dummy values while waiting for the forex API to be available
		// TODO: Remove this when the API is available
		currency: 'USD',
		captured_currency: 'KRW',

		// Note: Returing dummy value while waiting for the forex API to be available
		// TODO: Remove this when the API is available
		amount_in_captured_currency: function() {
			return this.get('amount') * 1000;
		}.property('amount'),

		isUSD: function() {
			return (this.get('captured_currency') === 'USD');
		},

		customer_name_summary: function() {
			if (this.get('customer')) {
				return this.get('customer.display_me_with_email');
			} else {
				return 'None';
			}
		}.property('customer'),

		page_title: Balanced.computed.orProperties('description', 'id'),
		events_uri: Balanced.computed.concat('uri', '/events'),

		status_description: function() {
			if (this.get('is_failed')) {
				if (this.get('failure_reason') || this.get('failure_reason_code')) {
					return this.get('failure_reason') || this.get('failure_reason_code');
				}
				return 'The transaction failed, no failure reason was given.';
			} else {
				return Ember.String.capitalize(this.get('status'));
			}
		}.property('is_failed', 'status', 'failure_reason', 'failure_reason_code'),

		is_failed: Computed.isStatus('failed'),
		is_pending: Computed.isStatus('pending'),
		is_succeeded: Computed.isStatus('succeeded')
	});

Balanced.Transaction.reopenClass({
	findAppearsOnStatementAsInvalidCharacters: function(originalString) {
		// ASCII letters (a-z and A-Z)
		// Digits (0-9)
		// Special characters (.<>(){}[]+&!$;-%_?:#@~=\'" ^`|)
		var SPECIAL_CHARS_REGEXP = /[.<>(){}\[\]+&!$;\-%_?:#@~=\\'" \^`|\w]/g;
		return originalString
			.replace(SPECIAL_CHARS_REGEXP, '')
			.split("")
			.uniq()
			.join("");
	}
});
