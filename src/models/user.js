var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
mongoose.set('debug', true);
var path = require('path');
var Models = require(path.join(__dirname,'models.js'));
var rankList = require(path.join(__dirname, 'enums', 'rankList.js'));
var roleList = require(path.join(__dirname, 'enums', 'roleList.js'));

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
    authentications: {
        local: {
            email: String,
            password: String
        },
        google: {
            email: String,
            userId: String
        }
    },
    birthdate: {
		type: Date,
		required: false
	},
	city: {
 		type: String,
		required: false
	},
	gender: {
		type: String,
		required: false,
		enum: ['male', 'female']
	},
	rating: {
		type: Number,
		required: false
	},
	lastLogin: {
		type: Date,
		required: false
	},
	rank: {
		type: String,
		required: false,
		enum: rankList
	},
	friends: [{
		type: Schema.Types.ObjectId,
		ref: Models.User,
		required: false
	}],
	role: {
		type: String,
		required: true,
		enum: roleList,
		default: "user"
	}
});

UserSchema.plugin(timestamps);


module.exports = mongoose.model(Models.User, UserSchema);