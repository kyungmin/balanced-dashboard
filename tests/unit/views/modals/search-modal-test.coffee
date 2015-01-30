`import { test, moduleFor } from 'ember-qunit';`

moduleFor("view:modals/search-modal", "View - SearchModalView")

test "selected tab", ->
	subject = @subject()
	t = (tabValue, selectionTest) ->
		subject.set "selectedTabType", "xxxxxxxxxx"
		deepEqual subject.get(selectionTest), false, "#{selectionTest} is false when value is 'xxxxxxxxxx'"
		subject.set "selectedTabType", tabValue
		deepEqual subject.get(selectionTest), true, "#{selectionTest} is true when value is '#{tabValue}'"

	t("order_transaction", "isOrdersTabSelected")
	t("customer", "isCustomersTabSelected")
	t("funding_instrument", "isFundingInstrumentsTabSelected")
	t("account", "isAccountsTabSelected")
	t("settlement", "isSettlementsTabSelected")
	t("log", "isLogsTabSelected")

test "#totalResults", ->
	subject = @subject()
	subject.set("resultsLoader", {
		results: {
			total_results: 10
		}
	})
	deepEqual(subject.get("totalResults"), 10)
	subject.set("logsResultsLoader",
		results: [4]
	)
	deepEqual(subject.get("totalResults"), 11)

test "#hasResults", ->
	subject = @subject()
	deepEqual(subject.get("hasResults"), 0, "Is falsy when there are no results")
	subject.set("resultsLoader", {
		results: {
			total_results: 10
		}
	})
	deepEqual(subject.get("hasResults"), 10)
