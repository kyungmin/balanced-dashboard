import BaseResultsLoader from "./base";
import Settlement from "../bk/settlement";

var SettlementsResultsLoader = BaseResultsLoader.extend({
	resultsType: Settlement,
});

export default SettlementsResultsLoader;
