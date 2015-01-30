import TextFormFieldView from "./text-form-field";

var StatementDescriptorTextFormFieldView = TextFormFieldView.extend({
	maxlength: 0,
	labelText: "On statement as",
	explanationText: function() {
		var maxLength = this.get('maxlength');

		if (maxLength > 0) {
			var noteLength = this.get('value') ? this.get('value.length') : 0;
			var remaining = maxLength - noteLength;
			var unit = (remaining === 1) ? "character" : "characters";

			return "%@ %@ remaining".fmt(remaining, unit);
		}
	}.property('value.length'),
});

export default StatementDescriptorTextFormFieldView;
