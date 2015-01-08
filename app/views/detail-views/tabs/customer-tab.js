import { defineFilter } from "balanced-dashboard/views/results/results-dropdown-filter";
import TabView from "./tab";

var CustomerTabView = TabView.extend({
	tabs: function(){
		return [
			defineFilter("Activity", "activity", true),
			defineFilter("Disputes", "disputes"),
			defineFilter("Payment methods", "paymentMethods"),
			defineFilter("Logs & Events", "logsEvents"),
		];
	}.property(),
});

export default CustomerTabView;
