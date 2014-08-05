Balanced.CustomerView = Ember.View.extend({
	titleText: "Hello"
});
Balanced.register('view:customer', Balanced.CustomerView, {
	singleton: true
});
