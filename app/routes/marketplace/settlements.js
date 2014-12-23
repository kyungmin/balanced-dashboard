import AuthRoute from "../auth";
import LegacyResultsLoaderWrapper from "balanced-dashboard/utils/legacy-results-loader-wrapper";

var MarketplaceSettlementsRoute = AuthRoute.extend({
	pageTitle: 'Settlements',
	model: function() {
		var store = this.container.lookup("controller:marketplace").get("store");
		return store.fetchCollection("settlement", "/settlements", { limit: 50 }).then(function(collection) {
			var wrapper = LegacyResultsLoaderWrapper.create({collection: collection});
			return wrapper;
		});
	},
});

export default MarketplaceSettlementsRoute;
