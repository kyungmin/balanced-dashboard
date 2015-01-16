`import Ember from "ember";`
`import BkBankAccount from "balanced-addon-models/models/bank-account";`
`import BkUtils from "balanced-dashboard/utils/bk-utils";`

BankAccount = BkBankAccount.extend(
    routeName: "bank_accounts"
    toLegacyModel: BkUtils.generateToLegacyModelMethod("bank_account")
)

`export default BankAccount;`
