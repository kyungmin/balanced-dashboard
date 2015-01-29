import Ember from "ember";

var MarketplaceSettlementsController = Ember.ObjectController.extend({
	needs: ['marketplace'],
	resultsLoader: Ember.computed.oneWay("model"),
	actions: {
		changeDateFilter: function(startTime, endTime) {
			this.get("resultsLoader").setProperties({
				endTime: endTime,
				startTime: startTime
			});
		},
	}
});

export default MarketplaceSettlementsController;
