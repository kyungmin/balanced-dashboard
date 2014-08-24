var Wide = Balanced.Modals.WideModalMixin;
var Save = Balanced.Modals.ObjectActionMixin;

Balanced.Modals.InvoiceFundingSourceEditModalView = Balanced.ModalBaseView.extend(Wide, Save, {
	templateName: 'modals/invoice_funding_source_edit_modal',
	title: 'Change default payment method',
	elementId: 'change-funding-source',

	model: function() {
		// operate on a copy so we don't mess up the original object
		var invoice = Ember.copy(this.get('invoice'), true);
		invoice.setProperties({
			isNew: false,
		});
		return invoice;
	}.property("invoice"),

	sourceId: function(a, value) {
		if (arguments.length > 1) {
			var source = this.get("marketplace.owner_customer.bank_accounts").findBy("id", value);
			this.get("model").setProperties({
				source_uri: source && source.get("uri"),
				source: source
			});
		}
		return this.get("model.source.id");
	}.property("model.source.id"),
	sourceBankAccountName: Ember.computed.oneWay("model.source.name"),
	sourceBankName: Ember.computed.oneWay("model.source.bank_name"),

	debitable_bank_accounts: Ember.computed.filterBy("marketplace.owner_customer.bank_accounts", "can_debit"),

	actions: {
		save: function() {
			this.save(this.get("model"));
		}
	}
});

Balanced.Modals.InvoiceFundingSourceEditModalView.reopenClass({
	open: function(invoice, marketplace) {
		var view = this.create({
			invoice: invoice,
			marketplace: marketplace
		});

		return view;
	}
});
