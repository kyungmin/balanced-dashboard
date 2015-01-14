`import ModelRoute from "./model"`

AccountRoute = ModelRoute.extend(
	model: (params) ->
		store = @getStore()
		store.fetchItem("account", "/accounts/#{params.item_id}")

	setupController: (controller, model) ->
		@_super(controller, model)

		this.get("container").lookupFactory("model:customer").find(model.get("customer_uri")).then (customer) ->
			model.set("customer", customer)

		settlementsResultsLoader = this.get("container").lookupFactory("results-loader:transactions").create({
			path: model.get("settlements_uri")
		});

		unsettledCreditsResultsLoader = this.get("container").lookupFactory("results-loader:unsettled_transactions").create({
			path: model.get("credits_uri"),
			settlementsResultsLoader: settlementsResultsLoader
		});

		controller.set("creditsResultsLoader", unsettledCreditsResultsLoader);
		controller.set("settlementsResultsLoader", settlementsResultsLoader);
)

`export default AccountRoute`
