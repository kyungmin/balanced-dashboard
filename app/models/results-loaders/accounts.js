import BaseResultsLoader from "./base";
import Account from "../bk/account";

var AccountsResultsLoader = BaseResultsLoader.extend({
	resultsType: Account,
});

export default AccountsResultsLoader;
