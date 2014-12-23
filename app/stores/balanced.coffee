`import Store from "balanced-addon-models/stores/balanced";`

BalancedStore = Store.extend(
	modelMaps:
		bank_account: "model:bk/bank-account"
		customer: "model:bk/customer"
		account: "model:bk/customer"
		settlement: "model:bk/customer"
)

`export default BalancedStore;`
