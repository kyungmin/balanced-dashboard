`import Base from "./base-status";`

OrderStatus = Base.extend(
	text: Ember.computed "model.isOverdue", ->
		if @get("model.isOverdue")
			"Overdue"
		else
			"Inactive"

	description: Ember.computed("model.isOverdue", ->
		if @get("model.isOverdue")
			"Funds in this order are older than 30 days. Pay out your outstanding balance now."
	)
)

`export default OrderStatus;`
