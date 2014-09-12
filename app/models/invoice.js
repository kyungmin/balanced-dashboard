var Computed = {
	uri: function(key) {
		return Balanced.computed.concat('uri', '/' + key);
	},
	date: function(p) {
		return function() {
			var period = this.get('period');
			if (!period) {
				return this.get('created_at');
			}
			return period[p];
		}.property('period');
	}
};

Balanced.Invoice = Balanced.Model.extend({
	route_name: 'invoice',

	page_title: Balanced.computed.fmt('sequence_number', 'No. %@'),
	type_name: 'Account statement',

	source: Balanced.Model.belongsTo('source', 'Balanced.FundingInstrument'),

	bank_account_debits: Balanced.Model.hasMany('bank_account_debits', 'Balanced.Debit'),
	card_debits: Balanced.Model.hasMany('card_debits', 'Balanced.Debit'),
	debits: Balanced.Model.hasMany('debits', 'Balanced.Debit'),
	credits: Balanced.Model.hasMany('bank_account_credits', 'Balanced.Credit'),
	holds: Balanced.Model.hasMany('holds', 'Balanced.Hold'),
	failed_credits: Balanced.Model.hasMany('failed_credits', 'Balanced.Credit'),
	lost_debit_chargebacks: Balanced.Model.hasMany('lost_debit_chargebacks', 'Balanced.Debit'),
	refunds: Balanced.Model.hasMany('refunds', 'Balanced.Refund'),
	reversals: Balanced.Model.hasMany('reversals', 'Balanced.Reversal'),
	settlements: Balanced.Model.hasMany('settlements', 'Balanced.Settlement'),
	disputes: Balanced.Model.hasMany('disputes', 'Balanced.Dispute'),

	from_date: Computed.date(0),
	to_date: Computed.date(1),

	typeChanged: function() {
		if (this.get('type') === 'fee') {
			this.set('type', 'transaction');
		}
	}.observes('type').on('init'),

	invoice_type: function() {
		if (this.get('isDispute')) {
			return 'Disputes';
		} else {
			return 'Transactions';
		}
	}.property('isDispute'),

	getInvoicesLoader: function() {
		return Balanced.DisputesResultsLoader.create({
			// Note: The Api is throwing an error when fetching the disputes using /invoices/:invoice_id/disputes
			// so we are defaulting this to created_at for now.
			// description: "Unable to sort on unknown field "initiated_at" Your request id is OHM4eadba4c092211e4b88e02b12035401b."
			sort: "created_at,desc",
			path: this.get("disputes_uri"),
		});
	},

	getTransactionsLoader: function(attributes) {
		attributes = _.extend({
			invoice: this
		}, attributes);
		return Balanced.InvoiceTransactionsResultsLoader.create(attributes);
	},

	isDispute: Ember.computed.equal('type', 'dispute'),

	hasHoldsFee: Ember.computed.gt('holds_total_fee', 0),

	subtotal: function() {
		var total = this.get('total_fee');
		var adjustments = this.get('adjustments_total_fee');
		if (Ember.isNone(total) || Ember.isNone(adjustments)) {
			return undefined;
		}
		return total - adjustments;
	}.property('total_fee', 'adjustments_total_fee'),

	is_scheduled: Ember.computed.equal('state', 'scheduled'),

	status: function() {
		if (this.get('total_fee') === 0) {
			return 'paid';
		} else {
			return this.get('state');
		}
	}.property('state', 'total_fee'),

	is_not_paid: function() {
		return this.get('status') !== 'paid';
	}.property('status'),

	reversal_fee: 0,

	// TODO - take all these URIs out once invoice has links for them
	bank_account_debits_uri: Computed.uri('bank_account_debits'),
	card_debits_uri: Computed.uri('card_debits'),
	debits_uri: Computed.uri('debits'),
	bank_account_credits_uri: Computed.uri('bank_account_credits'),
	holds_uri: Computed.uri('holds'),
	failed_credits_uri: Computed.uri('failed_credits'),
	lost_debit_chargebacks_uri: Computed.uri('lost_debit_chargebacks'),
	refunds_uri: Computed.uri('refunds'),
	reversals_uri: Computed.uri('reversals'),
	disputes_uri: Computed.uri('disputes')
});

Balanced.TypeMappings.addTypeMapping('invoice', 'Balanced.Invoice');
