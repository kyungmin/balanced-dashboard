`import ModelRoute from "./model";`
`import Settlement from "../models/bk/settlement";`

SettlementRoute = ModelRoute.extend(
	model: (params) ->
		store = @getStore()
		store.fetchItem("settlement", "/settlements/#{params.item_id}")

	setupController: (controller, model) ->
		@_super(controller, model)

		store = @getStore()
		store.fetchItem("account", model.get("source_uri")).then (source) ->
			model.set("source", source)

		this.get("container").lookupFactory("model:bank_account").find(model.get("destination_uri")).then (destination) ->
			model.set("destination", destination)

		creditsResultsLoader = this.get("container").lookupFactory("results-loader:transactions").create({
			path: model.get("credits_uri")
		});

		controller.set("creditsResultsLoader", creditsResultsLoader);
)

`export default SettlementRoute;`
