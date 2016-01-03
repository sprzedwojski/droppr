/* jshint node: true */
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
mongoose.set('debug', true);
var path = require('path');
var Models = require(path.join(__dirname,'models.js'));


var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	surname: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	passwordHash: {
		type: String,
		required: true
	}
});

UserSchema.plugin(timestamps);


module.exports = mongoose.model(Models.User, UserSchema);