import SummarySectionView from "./summary-section";
import Utils from "balanced-dashboard/lib/utils";

var SettlementSummarySectionView = SummarySectionView.extend({
	linkedResources: function() {
		return _.flatten([
			this.generateDescriptionResource(this.get("model")),
			this.get("sourceResource"),
			this.get("destinationResource"),
			this.generateResourceLink(this.get("model"), this.get("model.customer"))
		]).compact();
	}.property("model.description", "model.customer", "sourceResource", "destinationResource"),

	sourceResource: function() {
		return this.getResource("From", this.get("model.source"));
	}.property("model.source", "model.source.isLoaded", "model.source.type_name"),

	destinationResource: function() {
		return this.getResource("To", this.get("model.destination"));
	}.property("model.destination", "model.destination.isLoaded", "model.destination.type_name"),

	getResource: function(title, resource) {
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
