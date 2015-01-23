import Rev1Serializer from "./rev1";

var TransactionSerializer = Rev1Serializer.extend({
	_propertiesMap: function(record) {
		var json = this._super(record);

		if (!Ember.isBlank(json.order_uri)) {
			json.order = json.order_uri;
			delete json.order_uri;
		}

		console.log(json);
		return json;
	}
})


export default TransactionSerializer;
