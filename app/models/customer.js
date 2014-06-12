var CUSTOMER_TYPES = {
	BUSINESS: 'Business',
	PERSON: 'Person'
};

Balanced.Customer = Balanced.Model.extend({
	bank_accounts: Balanced.Model.hasMany('bank_accounts', 'Balanced.BankAccount'),
	cards: Balanced.Model.hasMany('cards', 'Balanced.Card'),
	transactions: Balanced.Model.hasMany('transactions', 'Balanced.Transaction'),
	debits: Balanced.Model.hasMany('debits', 'Balanced.Debit'),
	credits: Balanced.Model.hasMany('credits', 'Balanced.Credit'),
	holds: Balanced.Model.hasMany('holds', 'Balanced.Hold'),
	refunds: Balanced.Model.hasMany('refunds', 'Balanced.Refund'),
	orders: Balanced.Model.hasMany('orders', 'Balanced.Order'),
	// disputes: Balanced.Model.hasMany('disputes', 'Balanced.Dispute'),

	uri: '/customers',
	route_name: 'customer',

	has_bank_account: Ember.computed.and('bank_accounts.isLoaded', 'bank_accounts.length'),

	debitable_bank_accounts: function() {
		return this.get('bank_accounts').filterBy('can_debit');
	}.property('bank_accounts.@each.can_debit'),

	creditable_cards: function() {
		return this.get('cards');
	}.property('cards'),

	has_debitable_bank_account: function() {
		return this.get('bank_accounts').isAny('can_debit');
	}.property('bank_accounts.@each.can_debit'),

	debitable_funding_instruments: function() {
		return this.get('debitable_bank_accounts').concat(this.get('cards.content'));
	}.property('debitable_bank_accounts', 'cards.@each'),

	creditable_funding_instruments: function() {
		return this.get('bank_accounts.content').concat(this.get('creditable_cards.content'));
	}.property('bank_accounts.@each', 'creditable_cards.@each'),

	type: function() {
		return (this.get('ein') || this.get('business_name')) ? CUSTOMER_TYPES.BUSINESS : CUSTOMER_TYPES.PERSON;
	}.property('ein', 'business_name'),

	is_business: Ember.computed.equal('type', CUSTOMER_TYPES.BUSINESS),
	is_person: Ember.computed.equal('type', CUSTOMER_TYPES.PERSON),
	display_me: Balanced.computed.orProperties('name', 'id'),

	display_me_with_email: function() {
		var name = this.get('display_me');
		var email = this.get('email');

		if (email) {
			return "%@ (%@)".fmt(name, email);
		} else {
			return name;
		}
	}.property('display_me', 'email'),

	page_title: Ember.computed.readOnly('displayName'),

	facebook_id: Balanced.computed.orProperties('facebook', 'meta.facebook'),
	twitter_id: Balanced.computed.orProperties('twitter', 'meta.twitter'),

	facebook_url: function() {
		if (this.get('facebook_id')) {
			return 'http://facebook.com/profile.php?id=' + this.get('facebook_id');
		} else {
			return undefined;
		}
	}.property('facebook_id'),

	twitter_url: function() {
		if (this.get('twitter_id')) {
			return 'http://twitter.com/' + this.get('twitter_id');
		} else {
			return undefined;
		}
	}.property('twitter_id'),

	displayName: function() {
		var name;
		if (this.get('is_business')) {
			name = this.get('business_name');
		} else {
			name = this.get('name');
		}
		var email = this.get('email');
		if (name) {
			if (email) {
				name += ' (%@)'.fmt(email);
			}
		} else {
			name = email;
		}
		return name;
	}.property('is_business', 'business_name', 'name', 'email'),

	country_name: function() {
		return Balanced.CountryCodesToNames[this.get('address.country_code')];
	}.property('address.country_code'),

	address_string: function() {
		var seperator = ', ';
		var addressParts = [];
		var city = this.get('address.city');
		var cityLine = '';

		addressParts.push(this.get('address.line1'));
		addressParts.push(this.get('address.line2'));

		cityLine = (city ? city + ', ' : '') + ' ' + (this.get('address.postal_code') || '');
		addressParts.push($.trim(cityLine));
		addressParts.push(this.get('address.country_code'));

		addressParts = _.compact(addressParts);
		return addressParts.join(seperator);
	}.property('address.line1', 'address.line2', 'address.city', 'address.state', 'address.postal_code', 'address.country_code'),

	dob: function() {
		var month = this.get('dob_month');
		var year = this.get('dob_year');

		if (month && year) {
			return "%@-%@".fmt(year, month);
		} else {
			return year;
		}
	}.property('dob_month', 'dob_year'),

	dob_error: Balanced.computed.orProperties('validationErrors.dob_month', 'validationErrors.dob_year'),
	is_identity_verified: Ember.computed.equal('merchant_status', 'underwritten'),
});

Balanced.Customer.reopenClass({
	findByNameOrEmail: function(marketplace, query) {
		return marketplace.search(query, "Balanced.Customer", {
			type: "customer"
		});
	}
});

Balanced.TypeMappings.addTypeMapping('customer', 'Balanced.Customer');
