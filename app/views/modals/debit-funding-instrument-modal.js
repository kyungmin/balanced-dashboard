import BaseFundingInstrumentModalView from "./base-funding-instrument-modal";
import DebitExistingFundingInstrumentTransactionFactory from "balanced-dashboard/models/factories/debit-existing-funding-instrument-transaction-factory";

var DebitFundingInstrumentModalView = BaseFundingInstrumentModalView.extend({
	templateName: 'modals/debit-funding-instrument',
	elementId: 'debit-funding-instrument',
	title: function() {
		return "Debit this %@".fmt(this.get("model.source.type_name").toLowerCase());
	}.property("model.source.type_name"),
	cancelButtonText: "Cancel",
	submitButtonText: "Debit",

	appearsOnStatementAsMaxLength: Ember.computed.reads("model.source.appears_on_statement_max_length"),
});

DebitFundingInstrumentModalView.reopenClass({
	open: function(fundingInstrument) {
		var debit = DebitExistingFundingInstrumentTransactionFactory.create({
			source: fundingInstrument,
			customer: fundingInstrument.get("customer")
		});
		return this.create({
			model: debit
		});
	},
});

export default DebitFundingInstrumentModalView;
