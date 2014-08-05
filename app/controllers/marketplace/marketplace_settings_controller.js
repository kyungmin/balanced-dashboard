var actionsMixin = Balanced.ActionEvented('openDeleteModal', 'openDeleteCallbackModal');
Balanced.MarketplaceSettingsController = Balanced.ObjectController.extend(actionsMixin, {
	needs: ["marketplace"],

	can_edit: Ember.computed.alias('production'),

	ownerCustomer: Ember.computed.oneWay("marketplace.owner_customer"),

	addSidePanelView: function(view) {
		this.get("additionalSidePanelViews").addObject(view);
	},
	additionalSidePanelViews: function() {
		return [];
	}.property(),

	additionalInfo: function() {
		var view = Balanced.TitledKeyValuesSectionView.create({
			model: this.get("model")
		});
		return view;

	}.property("model"),

	fundingInstrumentsResultsLoader: function() {
		if (this.get("owner_customer")) {
			return this.get("owner_customer").getFundingInstrumentsLoader({
				limit: 10
			});
		} else {
			return Balanced.ResultsLoader.create();
		}
	}.property("owner_customer"),

	userMarketplace: function() {
		var user = this.get('user');
		var currentUserMarketplace = user.user_marketplace_for_id(this.get('id'));
		return currentUserMarketplace;
	}.property('user', 'id'),

	marketplaceSecret: function() {
		return this.get('userMarketplace.secret') || '';
	}.property('userMarketplace', 'userMarketplace.secret')
});
