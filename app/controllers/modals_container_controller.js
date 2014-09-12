Balanced.ModalsContainerController = Ember.Controller.extend({
	needs: ['notification_center', 'modal_notification_center'],
	registerContainer: function(modalsContainer) {
		this.set("modalsContainer", modalsContainer);
	},

	close: function() {
		var modalsContainer = this.get("modalsContainer");
		if (modalsContainer) {
			modalsContainer.forEach(function(modal) {
				modal.close();
			});
		}
	},

	open: function(klass, args) {
		this.close();
		var modalView = klass;
		if (Ember.typeOf(klass) === "class") {
			modalView = klass.open.apply(klass, args);
		}

		var modalsContainer = this.get("modalsContainer");

		Ember.run(function() {
			modalsContainer.pushObject(modalView);
		});
		modalView
			.open()
			.on("hidden.bs.modal", function() {
				modalsContainer.removeObject(modalView);
			});

		return modalView;
	},
});
