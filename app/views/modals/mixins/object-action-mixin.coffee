`import Ember from "ember";`

ObjectActionMixin = Ember.Mixin.create(
	isSaving: false

	executeAction: (callback) ->
		notificationsController = @getModalNotificationController()
		if notificationsController
			notificationsController.clearAlerts()

		successHandler = (model) =>
			successAlertText = @get("successAlertText")
			if !Ember.isBlank(successAlertText)
				@getNotificationController().alertSuccess successAlertText

			if Ember.typeOf(@onModelSaved) == "function"
				@onModelSaved model

			@close()
			return Ember.RSVP.resolve(model)

		errorHandler = (model) ->
			if !Ember.isBlank(model)
				Ember.A(model.get("errors._root")).forEach (message) ->
					notificationsController.alertError(message)
				return Ember.RSVP.reject(model)
			else
				return Ember.RSVP.reject()

		@set("isSaving", true)
		return callback()
			.then(successHandler, errorHandler)
			.finally(=> @set("isSaving", false))

	delete: (model) ->
		@executeAction ->
			return model.delete()

	save: (model) ->
		@executeAction ->
			return model.save()
)

`export default ObjectActionMixin;`
