import SummarySectionView from "./summary-section";
import Utils from "balanced-dashboard/lib/utils";

var AccountSummarySectionView = SummarySectionView.extend({
	linkedResources: function() {
		return this.resourceLinks("model.customer");
	}.property('model.customer'),
});

export default AccountSummarySectionView;
