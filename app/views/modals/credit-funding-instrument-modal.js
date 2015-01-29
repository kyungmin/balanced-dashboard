import BaseFundingInstrumentModalView from "./base-funding-instrument-modal";
import Utils from "balanced-dashboard/lib/utils";
import CreditExistingFundingInstrumentTransactionFactory from "balanced-dashboard/models/factories/credit-existing-funding-instrument-transaction-factory";

var CreditFundingInstrumentModalView = BaseFundingInstrumentModalView.extend({
	templateName: 'modals/credit-funding-instrument',
	elementId: 'credit-funding-instrument',
	title: function() {
		return "Credit this %@".fmt(this.get("model.destination.type_name").toLowerCase());
	}.property("model.destination.type_name"),
	cancelButtonText: "Cancel",
	submitButtonText: "Credit",

	expectedDateText: function() {
		var creditDate = this.get("model.destination.expected_credit_date");
		return "This credit is expected to appear on %@.".fmt(Utils.humanReadableDate(creditDate));
	}.property("model.destination.expected_credit_date"),

	appearsOnStatementAsLabelText: function() {
		var length = this.get("model.destination.appears_on_statement_max_length");
		return "Appears on statement as (%@ characters max)".fmt(length);
	}.property("model.destination.appears_on_statement_max_length"),

});

CreditFundingInstrumentModalView.reopenClass({
	open: function(fundingInstrument) {
		var credit = CreditExistingFundingInstrumentTransactionFactory.create({
			destination: fundingInstrument
		});
		return this.create({
			model: credit
		});
	},
});

export default CreditFundingInstrumentModalView;
