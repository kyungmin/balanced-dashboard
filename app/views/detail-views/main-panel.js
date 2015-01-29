import Ember from "ember";

var MainPanelView = Ember.View.extend({
	classNameBindings: [":main-panel", ":span"],
	isActivityTabSelected: true
});

export default MainPanelView;
