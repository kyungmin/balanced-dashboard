require('app/views/detail_views/summary_section_view');

Balanced.ListSectionView = Balanced.SummarySectionView.extend({
	templateName: "detail_views/list_section",
});

Balanced.OrderSellerSectionView = Balanced.ListSectionView.extend({
	title: "Seller",

	linkedResources: function() {
		return this.resourceLinks("model.seller");
	}.property("model.seller")
});

Balanced.OrderBuyersSectionView = Balanced.ListSectionView.extend({
	title: function() {
		var titleText = ' %@ ';
		var totalBuyers = this.get('totalBuyers');

		if (totalBuyers) {
			titleText += '(%@)'.fmt(totalBuyers);
		}

		return Balanced.Utils.safeFormat(titleText, "Buyers").htmlSafe();
	}.property('totalBuyers'),

	resources: Ember.computed.alias("buyersResults"),

	totalBuyers: function() {
		return this.get("buyersResults.total") - 1;
	}.property("buyersResults.total"),

	buyersResults: function() {
		return this.get("model").getBuyersResultsLoader({
			limit: 20
		}).get("results");
	}.property("model"),


	linkedResources: function() {
		return this.resourceLinks("buyersResults");
	}.property("buyersResults", "buyersResults.length")
});
