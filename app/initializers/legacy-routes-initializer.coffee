`import createRedirectRoute from "balanced-dashboard/utils/create-redirect-route";`

LegacyRoutesInitializer =
	name: "legacyRoutes"
	initialize: (container, App) ->
		defineRoute = (name, createArgs...) ->
			klass = createRedirectRoute(createArgs...)
			container.register("route:#{name}", klass)

		defineRoute("bank-account.index", 'activity.funding_instruments')
		defineRoute("cards.index", "activity.funding_instruments")

		defineRoute("marketplace.redirect-activity-transactions", "marketplace.orders")
		defineRoute("marketplace.redirect-transactions", "marketplace.orders")
		defineRoute("marketplace.redirect-activity-orders", "marketplace.orders")
		defineRoute("marketplace.redirect-activity-customers", "marketplace.customers")
		defineRoute("marketplace.redirect-activity-funding-instruments", "marketplace.funding-instruments")
		defineRoute("marketplace.redirect-activity-disputes", "marketplace.disputes")
		defineRoute("marketplace.redirect-invoices", "marketplace.invoices")

`export default LegacyRoutesInitializer`
