import BaseResultsLoader from "./base";
import Account from "../account";

var AccountsResultsLoader = BaseResultsLoader.extend({
	resultsType: Account,
});

export default AccountsResultsLoader;
