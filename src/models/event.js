
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
mongoose.set('debug', true);
var path = require('path');
var Models = require(path.join(__dirname, 'models.js'));
var eventTypeList = require(path.join(__dirname, 'enums', 'eventTypeList.js'));

var Schema = mongoose.Schema;

var EventSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	eventType: {
		type: String,
		required: true,
		enum: eventTypeList
	},
	lat: {
		type: Number,			
		required: true
	},
	lng: {
		type: Number,			
		required: true
	},
	eventTime: {
		type: Date,
		required: true
	},
	host: {
		type: Schema.Types.ObjectId,
		ref: Models.User,
		required: true
	},
	guests: [{
		type: Schema.Types.ObjectId,
		ref: Models.User,
		required: false
	}],
	minParticipants: {
		type: Number,
		required: false
	},
	maxParticipants: {
		type: Number,
		required: false
	}
});

EventSchema.plugin(timestamps);


module.exports = mongoose.model(Models.Event, EventSchema);