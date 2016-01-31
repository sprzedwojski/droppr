var path = require('path');
var EventModel = require(path.join(__dirname, '..', '..', 'models', 'event.js'));
var UserModel = require(path.join(__dirname, '..', '..', 'models', 'user.js'));
var logger = require(path.join(__dirname, '..', '..', 'utils', 'logger.js'));
var validator = require(path.join(__dirname, '..', '..', 'utils', 'validator.js'));
var queryParamUtils = require(path.join(__dirname, '..', '..', 'utils', 'queryParamUtils.js'));
var eventTypeList = require(path.join(__dirname, '..', '..', 'models', 'enums', 'eventTypeList.js'));
var errorCodes = require(path.join(__dirname, '..', '..', '..', 'errorCodes.js'));

module.exports.createEventFilterDataHolder = function(req, callback) {
    var data = {};
    if (validator.isValid(req.query.eventType)) {
        if (eventTypeList.indexOf(req.query.eventType) < 0) {
            return callback(errorCodes.invalidEventType);
        }
        data.eventType = req.query.eventType;
    }
    if (validator.isValid(req.query.name)) {
        data.name = new RegExp(req.query.name, "i");
    }
    if (validator.isValid(req.query.guestCount)) {
        if (isNaN(req.query.guestCount)) {
            return callback(errorCodes.invalidGuestCountFormat);
        }
        data.guests = {
            $size: req.query.guestCount
        };
    }
    if (validator.isValid(req.query.numParticipants)) {
        if (isNaN(req.query.numParticipants)) {
            return callback(errorCodes.invalidNumParticipantsFormat);
        }
        data.minParticipants = {
            $lte: req.query.numParticipants
        };
        data.maxParticipants = {
            $gte: req.query.numParticipants
        };
    }
    if (validator.isValid(req.query.timeFrom) || validator.isValid(req.query.timeTo)) {
        if (!validator.isDateTimeRangeValid(req.query.timeFrom, req.query.timeTo)) {
            return callback(errorCodes.invalidDates);
        }
        data.eventTime = queryParamUtils.handleTimeFrameQueryParam(req);
    }
    if(validator.isValid(req.query.lat) && validator.isValid(req.query.lng) && validator.isValid(req.query.tolerance)){
        data.lat = {
            $gte: req.query.lat - req.query.tolerance,
            $lte: req.query.lat + req.query.tolerance,
        };
        data.lng = {
            $gte: req.query.lng - req.query.tolerance,
            $lte: req.query.lng + req.query.tolerance,
        };
    }

    return callback(null, data);
};


module.exports.buildGetParticipantsJSON = function(doc) {
    var participants = doc.guests;
    participants.push(doc.host);
    return {
        host: doc.host,
        participants: participants
    };
};

module.exports.parsePostEventFields = function(req) {
    var event = new EventModel();
    event.name = req.body.name;
    event.eventType = req.body.eventType;
    event.lat = req.body.lat;
    event.lng = req.body.lng;
    event.eventTime = req.body.eventTime;
    event.host = req.body.host;
    if (validator.isValid(req.body.guests)) {
        event.guests = JSON.parse(req.body.guests).concat();
    }
    if (validator.isValid(req.body.minParticipants)) {
        event.minParticipants = req.body.minParticipants;
    }
    if (validator.isValid(req.body.maxParticipants)) {
        event.maxParticipants = req.body.maxParticipants;
    }
    return event;
};

module.exports.checkEventExists = function(req, res, next, callback) {
    EventModel.findById(req.params.id, function(err, doc) {
        if (err) {
            return next(err);
        }
        if (!doc) {
            return next({
                status: 404,
                message: 'Event does not exist'
            });
        } else {
            callback(req, res, next);
        }
    });
};


module.exports.buildPutEventSet = function(req) {
    var set = {};
    if (validator.isValid(req.body.name)) {
        set.name = req.body.name;
    }
    if (validator.isValid(req.body.eventType)) {
        set.eventType = req.body.eventType;
    }
    if (validator.isValid(req.body.lat)) {
        set.lat = req.body.lat;
    }
    if (validator.isValid(req.body.lng)) {
        set.lng = req.body.lng;
    }
    if (validator.isValid(req.body.eventTime)) {
        set.eventTime = req.body.eventTime;
    }
    if (validator.isValid(req.body.host)) {
        set.host = req.body.host;
    }
    if (validator.isValid(req.body.guests)) {
        set.guests = JSON.parse(req.body.guests).concat();
    }
    if (validator.isValid(req.body.minParticipants)) {
        set.minParticipants = req.body.minParticipants;
    }
    if (validator.isValid(req.body.maxParticipants)) {
        set.maxParticipants = req.body.maxParticipants;
    }
    return set;
};

module.exports.checkIfUserExists = function(req, callback) {
    UserModel.findById(req.body._id, function(err, user) {
        if (err) {
            logger.error("Error finding user by id");
            return callback(err);
        }

        if (!user) {
            return callback(null, false);
        } else {
            return callback(null, true);
        }
    });
};

module.exports.addUserToEvent = function(userExists, req, callback) {
    var result = {};
    if (!userExists) {
        result.status = 404;
        result.message = {
            msg: "User doesn't exist"
        };
        return callback(null, result);
    } else {
        EventModel.findById(req.params.id, function(err, event) {
            if (err) {
                logger.error("Event not found. ID: " + req.params.id);
                return callback(err);
            }

            logger.info("Seems ok so far...");

            EventModel.update({
                _id: event._id
            }, {
                $push: {
                    guests: req.body._id
                }
            }, function(err) {
                if (err) {
                    logger.error("Problem updating list of event guests");
                    return callback(err);
                }

                result.status = 200;
                result.message = {
                    msg: "Guest added to event."
                };

                return callback(null, result);
            });
        });
    }
};