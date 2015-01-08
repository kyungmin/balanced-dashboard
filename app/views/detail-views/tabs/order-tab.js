import { defineFilter } from "balanced-dashboard/views/results/results-dropdown-filter";
import TabView from "./tab";

var OrderTabView = TabView.extend({
	tabs: function(){
		return [
			defineFilter("Activity", "activity", true),
			defineFilter("Logs & Events", "logsEvents"),
		];
	}.property(),
});

export default OrderTabView;
