var MarketplaceOrdersView = Ember.View.extend({
	layoutName: "marketplace/payments-layout",
	templateName: "marketplace/orders",
	hasResults: Ember.computed.gt("controller.resultsLoader.results.length", 0),
});

export default MarketplaceOrdersView;
