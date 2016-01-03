/* jshint node: true */

var path = require('path');
var EventModel = require(path.join(__dirname, '..', '..', 'models', 'event.js'));
var UserModel = require(path.join(__dirname, '..', '..', 'models', 'user.js'));
var logger = require(path.join(__dirname, '..', '..', 'utils', 'logger.js'));

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
    if (req.body.guests !== undefined) {
        event.guests = JSON.parse(req.body.guests).concat();
    }
    if (req.body.minParticipants !== undefined) {
        event.minParticipants = req.body.minParticipants;
    }
    if (req.body.maxParticipants !== undefined) {
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
    if (req.body.name !== undefined) {
        set.name = req.body.name;
    }
    if (req.body.eventType !== undefined) {
        set.eventType = req.body.eventType;
    }
    if (req.body.lat !== undefined) {
        set.lat = req.body.lat;       
    }
    if (req.body.lng !== undefined) {
        set.lng = req.body.lng;       
    }
    if (req.body.eventTime !== undefined) {
        set.eventTime = req.body.eventTime;
    }
    if (req.body.host !== undefined) {
        set.host = req.body.host;
    }
    if (req.body.guests !== undefined) {
        set.guests = JSON.parse(req.body.guests).concat();
    }
    if (req.body.minParticipants !== undefined) {
        set.minParticipants = req.body.minParticipants;
    }
    if (req.body.maxParticipants !== undefined) {
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