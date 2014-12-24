import SummarySectionView from "./summary-section";
import Utils from "balanced-dashboard/lib/utils";

var AccountSummarySectionView = SummarySectionView.extend({
	linkedResources: function() {
		return this.resourceLinks("model.balance", "model.customer");
	}.property('model.balance', 'model.customer'),
});

export default AccountSummarySectionView;
