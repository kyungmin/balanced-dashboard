`import Ember from "ember";`

LegacyResultsLoaderWrapper = Ember.Object.extend(
	results: Ember.computed.reads("collection")
	isLoading: Ember.computed.reads("collection.isLoading")

	loadNextPage: ->
		@get("collection").loadNextPage()
)

LegacyResultsLoaderWrapper.reopenClass(
	generateMethod: (methodName) ->
		return (attributes) ->
			LegacyResultsLoaderWrapper.createForCollection(=>
				return @[methodName](attributes || {})
			)

	createForCollection: (initializer) ->
		loader = @create(collection: [])
		if Ember.isArray(initializer)
			loader.set("collection", initializer)
		else
			initializer().then (collection) ->
				loader.set("collection", collection)
		loader
)

`export default LegacyResultsLoaderWrapper;`
