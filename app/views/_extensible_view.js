Balanced.ExtensibleView = Balanced.View.extend({
	addSidePanelView: function(view) {
		this.get("additionalSidePanelViews").addObject(view);
	},
	additionalSidePanelViews: function() {
		return [];
	}.property()
});
