import ModelRoute from "./model";
import Settlement from "../models/bk/settlement";

var SettlementRoute = ModelRoute.extend({
	title: 'Settlement',
	modelObject: Settlement,
	marketplaceUri: 'settlements_uri',
	setupController: function(controller, customer) {
		this._super(controller, customer);
	}
});

export default SettlementRoute;
