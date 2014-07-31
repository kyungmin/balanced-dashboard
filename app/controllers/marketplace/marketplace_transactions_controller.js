Balanced.MarketplaceTransactionsController = Balanced.ObjectController.extend(Ember.Evented, {
	needs: ['marketplace'],
	noDownloadsUri: true,

	resultsLoader: Ember.computed.oneWay("model"),
	actions: {
		changeTypeFilter: function(type) {
			if (type === "transaction") {
				type = null;
			}
			this.set("resultsLoader.type", type);
		},
		changeTransactionsSort: function(column) {
			this.get("resultsLoader").setSortField(column);
		},
		changeStatusFilter: function(status) {
			if (status === "all") {
				status = null;
			}
			this.set("resultsLoader.status", status);
		},
		changeDateFilter: function(startTime, endTime) {
			this.get("resultsLoader").setProperties({
				endTime: endTime,
				startTime: startTime
			});
		},
	}
});
