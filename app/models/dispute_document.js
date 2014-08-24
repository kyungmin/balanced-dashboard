Balanced.DisputeDocument = Balanced.Model.extend({
	dispute: Balanced.Model.belongsTo('dispute', 'Balanced.Dispute'),
	isUploading: false
});

Balanced.DisputeDocument.reopenClass({
	loadFromUri: function(uri) {
		return Balanced.LinkedModelArray.newArrayLoadedFromUri(uri, Balanced.DisputeDocument, "documents");
	},

	hasErrors: function(file) {
		if (file.size > Balanced.DISPUTE_DOCUMENTS.MAX_FILE_SIZE_BYTES || Balanced.DISPUTE_DOCUMENTS.ACCEPTED_MIME_TYPES.indexOf(file.type) < 0) {
			return true;
		}
		return false;
	}
});

Balanced.Adapter.registerHostForType(Balanced.DisputeDocument, ENV.BALANCED.JUSTITIA);

Balanced.TypeMappings.addTypeMapping('dispute_documents', 'Balanced.DisputeDocument');
