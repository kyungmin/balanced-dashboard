var Wide = Balanced.Modals.WideModalMixin;
var Save = Balanced.Modals.ObjectSaveMixin;

Balanced.Modals.CustomerBankAccountCreateModalView = Balanced.ModalBaseView.extend(Wide, Save, {
	templateName: 'modals/customer_bank_account_create_modal',
	elementId: "add-bank-account",
	title: "Add a bank account",

	bankAccountTypes: [{
		value: "checking",
		label: "Checking",
	}, {
		value: "savings",
		label: "Savings"
	}],

	model: function() {
		return Balanced.BankAccount.create({
			name: '',
			account_number: '',
			routing_number: '',
			account_type: 'checking'
		});
	}.property(),

	save: function(fundingInstrument) {
		var self = this;
		this.set("isSaving", true);
		fundingInstrument.set("validationErrors", null);
		return fundingInstrument
			.tokenizeAndCreate(this.get('customer.id'))
			.then(function(model) {
				self.set("isSaving", false);
				self.close();
				return model;
			}, function() {
				self.set("isSaving", false);
				return Ember.RSVP.reject();
			});
	},

	actions: {
		save: function() {
			var controller = this.get("controller");
			this.save(this.get("model"))
				.then(function(model) {
					controller.transitionToRoute(model.get("route_name"), model);
				});
		}
	}
});

Balanced.Modals.CustomerBankAccountCreateModalView.reopenClass({
	open: function(customer) {
		return this.create({
			customer: customer
		});
	}
});
