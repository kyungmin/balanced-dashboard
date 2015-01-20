import SummarySectionView from "./summary-section";
import Utils from "balanced-dashboard/lib/utils";

var SettlementSummarySectionView = SummarySectionView.extend({
	linkedResources: function() {
		return _.flatten([
			this.generateDescriptionResource(this.get("model")),
			this.get("customerResource"),
			this.get("sourceResource"),
			this.get("destinationResource"),
		]).compact();
	}.property("model.description", "customerResource", "sourceResource", "destinationResource"),

	sourceResource: function() {
		return this.getResource("From", this.get("model.source"));
	}.property("model.source", "model.source.isLoaded", "model.source.type_name"),

	destinationResource: function() {
		return this.getResource("To", this.get("model.destination"));
	}.property("model.destination", "model.destination.isLoaded", "model.destination.type_name"),

	customer: function() {
		var customerUri = this.get("model.destination.customer_uri");
		if (customerUri) {
			return this.container.lookupFactory("model:customer").find(customerUri);
		}
	}.property("model.destination.customer_uri"),

	customerResource: function(attr) {
		return this.getResource("Merchant", this.get("customer"));
	}.property("customer", "customer.isLoaded"),

	getResource: function(title, resource, className) {
		if (resource && resource.get("isLoaded")) {
			return {
				className: 'icon-%@'.fmt(Ember.String.dasherize(resource.get("type_name"))),
				title: title,
				resource: resource
			};
		}
		return null;
	},
});

export default SettlementSummarySectionView;
