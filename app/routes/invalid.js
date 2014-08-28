Balanced.InvalidRoute = Balanced.AuthRoute.extend({
	redirect: function() {
		Ember.Logger.warn("Invalid route specified: " + window.location.pathname + window.location.hash);
		Balanced.Analytics.trackEvent('route-error', {
			type: 'invalid-route',
			location: window.location.toString()
		});

		var controller = this.controllerFor('notification_center');
		controller.clearNamedAlert('InvalidUrl');

		controller.alertError("Invalid URL specified, please check the URL.", {
			name: 'InvalidUrl'
		});

		this.transitionTo('marketplaces');
	},

	model: function(params) {
		return null;
	}
});
