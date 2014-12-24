`import ModelRoute from "./model";`
`import Settlement from "../models/bk/settlement";`

SettlementRoute = ModelRoute.extend(
	model: (params) ->
		store = @getStore()
		store.fetchItem("settlement", "/settlements/#{params.item_id}")

	setupController: (controller, model) ->
		@_super(controller, model)

		creditsResultsLoader = this.get("container").lookupFactory("results-loader:transactions").create({
			path: model.get("credits_uri")
		});

		controller.set("creditsResultsLoader", creditsResultsLoader);
)

`export default SettlementRoute;`
