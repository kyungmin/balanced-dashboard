Balanced.Connections.AuthConnection = Balanced.Connections.BaseConnection.extend({
	csrfToken: $.cookie(Balanced.COOKIE.CSRF_TOKEN),
	getCsrfToken: function() {
		return this.get("csrfToken");
	},
	settings: function(additionalSettings) {
		var settings = _.extend({
			headers: {
				"X-CSRFToken": this.getCsrfToken()
			}
		}, additionalSettings);

		// This does NOT work in Firefox
		// See http://stackoverflow.com/questions/16668386/cors-synchronous-requests-not-working-in-firefox
		/* istanbul ignore if */
		if (!window.TESTING) {
			settings.xhrFields = {
				withCredentials: true
			};
		} else {
			settings.beforeSend = function(xhr) {
				xhr.withCredentials = true;
			};
		}
		return settings;
	}
});
