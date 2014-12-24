import TitledKeyValuesSectionView from "./titled-key-values-section";
import ListValueGenerator from "./list-value-generator";

var AccountTitledKeyValuesSectionView = TitledKeyValuesSectionView.extend({
	title: "Account information",

	keyValueListViews: ListValueGenerator.create()
		.add("Created at", "created_at")
		.add("Account ID", "id")
		.toProperty()
});

export default AccountTitledKeyValuesSectionView;
