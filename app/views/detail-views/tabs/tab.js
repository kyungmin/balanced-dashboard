import Utils from 'balanced-dashboard/lib/utils';

var TabView = Ember.View.extend({
	templateName: "detail-views/tab",
	isSelected: false,

	actions: {
		setTab: function(tabLink) {
			var self = this;
			var tabs = this.get("tabs");
			var isTabSelected = "";

			tabs.map(function(tab) {
				isTabSelected = "is%@TabSelected".fmt(Utils.capitalize(tab.value));
				self.get("parentView").set(isTabSelected, false);
				tab.set("isSelected", false);
			});

			isTabSelected = "is%@TabSelected".fmt(Utils.capitalize(tabLink.value));
			this.get("parentView").set(isTabSelected, true);
			tabLink.set("isSelected", true);
		}
	}

});

export default TabView;
