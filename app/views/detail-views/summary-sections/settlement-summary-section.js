import SummarySectionView from "./summary-section";
import Utils from "balanced-dashboard/lib/utils";

var SettlementSummarySectionView = SummarySectionView.extend({
	linkedResources: function() {
		return _.flatten([
			this.generateDescriptionResource(this.get("model")),
			this.getResource(this.get("model.source")),
			this.getResource(this.get("model.destination")),
			this.generateResourceLink(this.get("model"), this.get("model.customer"))
		]).compact();
	}.property("model.description", "model.source", "model.destination", "model.customer"),

	isSource: function(resource) {
		return this.get("model.source_uri").indexOf(resource.get("id")) >= 0;
	},

	isDestination: function(resource) {
		return this.get("model.destination_uri").indexOf(resource.get("id")) >= 0;
	},

	getResource: function(resource) {
		if (resource) {
			var title = "";

			if (this.isSource(resource)) {
				title = "From";
			} else if (this.isDestination(resource)) {
				title = "To";
			}

			return {
				className: 'icon-payable-account',
				title: title,
				resource: resource
			};
		}
		return null;
	},
});

export default SettlementSummarySectionView;
