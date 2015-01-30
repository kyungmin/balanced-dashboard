`import BaseStatus from "./base-status";`

OrderStatus = BaseStatus.extend(
	description: Ember.computed("model.isOverdue", "model.status", ->
		if @get("model.status") == "overdue"
			"Funds in this order are older than 30 days. Pay out your outstanding balance now."
		else if @get("model.status") == "completed"
			"All funds in this order are paid out. You may still have unsettled credits for your merchant."
	)
)

`export default OrderStatus;`
