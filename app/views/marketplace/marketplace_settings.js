Balanced.MarketplaceSettingsView = Balanced.ExtensibleView.extend({
	keySecret: false,

	actions: {
		openEditMarketplaceInfoModal: function() {
			this.get('editMarketplaceInfoModal').send('open');
		}
	}
});

Balanced.register('view:marketplace_settings', Balanced.MarketplaceSettingsView, {
	singleton: true
});
