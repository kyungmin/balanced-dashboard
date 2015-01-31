import BaseFormFieldView from "./base-form-field";

var CvvFormFieldView = BaseFormFieldView.extend({
	inputType: "text",
	maxlength: 4
});

export default CvvFormFieldView;
