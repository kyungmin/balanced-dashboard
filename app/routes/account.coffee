`import ModelRoute from "./model"`
`import LegacyResultsLoaderWrapper from "balanced-dashboard/utils/legacy-results-loader-wrapper";`

AccountRoute = ModelRoute.extend(
	model: (params) ->
		store = @getStore()
		store.fetchItem("account", "/accounts/#{params.item_id}")

	setupController: (controller, model) ->
		@_super(controller, model)

		this.get("container").lookupFactory("model:customer").find(model.get("customer_uri")).then (customer) ->
			model.set("customer", customer)

		creditsResultsLoader = this.get("container").lookupFactory("results-loader:transactions").create({
			path: model.get("credits_uri")
		});

		settlementsResultsLoader = this.get("container").lookupFactory("results-loader:transactions").create({
			path: model.get("settlements_uri")
		});

		controller.set("creditsResultsLoader", creditsResultsLoader);
		controller.set("settlementsResultsLoader", settlementsResultsLoader);
)

`export default AccountRoute`
