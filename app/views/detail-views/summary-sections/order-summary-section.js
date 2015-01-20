import SummarySectionView from "./summary-section";

var OrderSummarySectionView = SummarySectionView.extend({
	statusText: function() {
		if (this.get("model.status") === "overdue") {
			return "Funds in this order are older than 30 days. Pay out your outstanding balance now.";
		}
		return null;
	}.property("model.status"),

	linkedResources: function() {
		return _.flatten([
			this.generateDescriptionResource(this.get("model")),
			this.generateResourceLink(this.get("model"), this.get("model.seller")),
			{
				className: "icon-payable-account",
				title: "Merchant payable account",
				resource: this.get("sellerAccount")
			}
		]).compact();
	}.property("model.description", "model.seller", "model.seller.accounts_uri", "sellerAccount"),

	sellerAccount: function(attr) {
		var self = this;
		var accountsUri = this.get("model.seller.accounts_uri");

		if (accountsUri) {
			var store = this.container.lookup("controller:marketplace").get("store");
			store.fetchItem("account", accountsUri).then(function(account) {
				self.set(attr, account.toLegacyModel());
			});
		}
		return null;
	}.property("model.seller.accounts_uri")
});

export default OrderSummarySectionView;
