`import Store from "balanced-addon-models/stores/balanced";`

BalancedStore = Store.extend(
	modelMaps:
		bank_account: "model:bk/bank-account"
		customer: "model:bk/customer"
		account: "model:bk/account"
		settlement: "model:bk/settlement"
)

`export default BalancedStore;`
