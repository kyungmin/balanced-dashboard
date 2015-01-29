import Ember from "ember";
import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";
import Action from "balanced-dashboard/views/modals/mixins/object-action-mixin";
import Constants from "balanced-dashboard/utils/constants";
import DebitExistingFundingInstrumentTransactionFactory from "balanced-dashboard/models/factories/debit-existing-funding-instrument-transaction-factory";

var AddFundsModalView = ModalBaseView.extend(Full, Form, Action, {
	templateName: "modals/add-funds-modal",
	elementId: "add-funds",
	title: "Add funds",
	cancelButtonText: "Cancel",
	submitButtonText: "Add",

	appearsOnStatementAsMaxLength: Constants.MAXLENGTH.APPEARS_ON_STATEMENT_BANK_ACCOUNT,
	appearsOnStatementAsLabelText: function() {
		return "Appears on statement as (%@ characters max)".fmt(this.get("appearsOnStatementAsMaxLength"));
	}.property("appearsOnStatementAsMaxLength"),

	debitableBankAccounts: Ember.computed.readOnly("marketplace.owner_customer.debitable_bank_accounts"),
	debitableBankAccountsForSelect: Ember.computed.map("debitableBankAccounts", function(bankAccount) {
		return {
			value: bankAccount,
			label: bankAccount.get("description")
		};
	}),

	model: function() {
		return DebitExistingFundingInstrumentTransactionFactory.create();
	}.property(),

	onModelSaved: function(credit) {
		this.get('controller').transitionToRoute(credit.get('route_name'), credit);
		this.close();
	},

	actions: {
		save: function() {
			var model = this.get("model");
			this.save(model);
		}
	}
});

AddFundsModalView.reopenClass({
	open: function(marketplace) {
		return this.create({
			marketplace: marketplace
		});
	},
});

export default AddFundsModalView;
