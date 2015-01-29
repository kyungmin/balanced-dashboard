import ResultsDropdownFilterView from "./results-dropdown-filter";
import { defineFilter } from "./results-dropdown-filter";

var OrdersResultsDropdownFilterView = ResultsDropdownFilterView.extend({
	templateName: "results/grouped-results-dropdown-filter",
	toggleText: "Order",

	toggleSelected: function(filterLink, groupLabelText) {
		var filterGroup = this.get("filterGroups").findBy("groupLabelText", groupLabelText);

		filterGroup.filters.map(function(filter) {
			filter.set("isSelected", false);
		});

		filterLink.set("isSelected", true);

		if (filterLink.get('text') === "All") {
			this.set("isSelected", false);
		} else {
			this.set("isSelected", true);
		}
	}.observes("filterGroups"),

	filterGroups: function() {
		return [{
			groupLabelText: "Type",
			actionName: "changeTypeFilter",
			filters: [
				defineFilter("All", "transaction", true),
				defineFilter("Credits", "credit"),
				defineFilter("Debits", "debit"),
				defineFilter("Holds", "card_hold"),
				defineFilter("Refunds", "refund"),
				defineFilter("Reversals", "reversal")
			]
		}, {
			groupLabelText: "Status",
			actionName: "changeStatusFilter",
			filters: [
				defineFilter("All", undefined, true),
				defineFilter("Pending", "pending"),
				defineFilter("Succeeded", "succeeded"),
				defineFilter("Failed", "failed")
			]
		}];
	}.property(),

	actions: {
		setFilter: function(actionName, filterLink, groupLabelText) {
			var target = this.get("parentView");

			if (this.get("isSearch")) {
				target = this.container.lookup("controller:marketplace/search");
			}

			target.send(actionName, filterLink.value);
			this.toggleSelected(filterLink, groupLabelText);
		}
	}
});

export default OrdersResultsDropdownFilterView;
