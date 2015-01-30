`import BaseStatus from "./base-status";`

OrderStatus = BaseStatus.extend(
	description: Ember.computed("model.isOverdue", ->
		if @get("model.isOverdue")
			"Funds in this order are older than 30 days. Pay out your outstanding balance now."
	)
)

`export default OrderStatus;`
