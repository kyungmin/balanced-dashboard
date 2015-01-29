import AuthRoute from "../auth";

var MarketplaceImportPayoutsRoute = AuthRoute.extend({
	pageTitle: 'Import one-off credits',

	setupController: function(controller, model) {
		controller.refresh();
		this._super(controller, model);
	},

	renderTemplate: function() {
		this.render('import_payouts/index');
	}
});

export default MarketplaceImportPayoutsRoute;
