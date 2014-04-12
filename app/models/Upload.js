
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UPLOAD_DIR = __dirname + "/../../uploads"

var UploadSchema = new Schema({
	ip: String,
	ext: String,
	code: String,
	name: String,
	userId: String,
	date: Date,
	protected: Boolean
});

var Upload = mongoose.model('Uploads', UploadSchema);

Upload.prototype.getFullName = function getFullName() {
	return this.code + '.' + this.ext;
}

Upload.prototype.getPath = function getPath() {
	return UPLOAD_DIR + '/' + this.getFullName();
}

module.exports = Upload;
