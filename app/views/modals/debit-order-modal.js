import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";
import Constants from "balanced-dashboard/utils/constants";
import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";

var DebitOrderModalView = ModalBaseView.extend(Save, Full, Form, {
	templateName: "modals/debit-order-modal",
	elementId: "debit-order",
	title: "Debit into this order",
	cancelButtonText: "Cancel",
	submitButtonText: "Debit",

	model: function() {
		var DebitCardTransactionFactory = require("balanced-dashboard/models/factories/debit-card-transaction-factory")['default'];
		return DebitCardTransactionFactory.create({
			order:this.get("order")
		});
	}.property(),

	appearsOnStatementAsMaxLength: Constants.MAXLENGTH.APPEARS_ON_STATEMENT_CARD,

	actions: {
		save: function() {
			var controller = this.get("controller");
			this.save(this.get("model"))
				.then(function(model) {
					controller.transitionToRoute(model.get("route_name"), model);
				});
		},
	}
});

DebitOrderModalView.reopenClass({
	open: function(order) {
		return this.create({
			order: order
		});
	},
});

export default DebitOrderModalView;
