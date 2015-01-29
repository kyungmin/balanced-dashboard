import AuthRoute from "balanced-dashboard/routes/auth";

var MarketplaceIndexRoute = AuthRoute.extend({
	beforeModel: function() {
		this.transitionTo('marketplace.orders');
	}
});

export default MarketplaceIndexRoute;
