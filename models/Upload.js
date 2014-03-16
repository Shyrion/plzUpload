
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UploadSchema = new Schema({
	ip: String,
	ext: String,
	name: String,
	userId: String
});

var Upload = mongoose.model('Uploads', UploadSchema);

module.exports = Upload;
