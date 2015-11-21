/* jshint node: true */

/**
 * Author: szymon
 * Creation date: 20.11.15
 * Project: droppr
 */

var express = require('express');
var router = express.Router();
var path = require('path');
var EventModel = require(path.join(__dirname, '..', '..', 'models', 'event.js'));
var mongoose = require('mongoose');
mongoose.set('debug', true);
var logger = require(path.join(__dirname, '..', '..', 'utils', 'logger.js'));
var eventTypeList = require(path.join(__dirname, '..', '..', 'models', 'enums', 'eventTypeList.js'));

// GET ==========================================

/**
 * GET All events.
 */
router.get('/', function(req, res) {
    EventModel.find({}, function(err, events, next) {
        if (err) {
            logger.error("Error fetching all events.");
            return next(err);
        }

        logger.info(events.length + " events found.");
        res.send(events);
    });
});

/**
 * GET Details of an event.
 */
router.get('/:id', function(req, res, next) {
    EventModel.findById(req.params.id, function(err, doc) {
        if (err) {
            return next(err);
        }
        res.status(200).json(doc);
    });
});

/**
 * GET Participants of an event.
 */
router.get('/:id/participants', function(req, res, next) {
    EventModel.findById(req.params.id)
        .populate('host guests')
        .exec(function(err, doc) {
            if (err) {
                return next(err);
            }
            var participants = buildGetParticipantsJSON(doc);
            console.log(participants);
            res.status(200).json(participants);
        });
});


var buildGetParticipantsJSON = function(doc) {
    var participants = doc.guests;
    participants.push(doc.host);
    return {
        host: doc.host,
        participants: participants
    };
};

/**
 * GET List of event types.
 */

router.get('/types', function(req, res) {
    logger.info("Returning all event types.");
    res.send(eventTypeList);
});



// POST =========================================

/**
 * POST Create a new event.
 */
router.post('/', function(req, res, next) {
    var event = parsePostEventFields(req);
    event.save(function(err) {
        if (err) {
            return next(err);
        }
        res.status(201).json({
            msg: 'event created'
        });
    });

});

var parsePostEventFields = function(req) {
    var event = new EventModel();
    event.name = req.body.name;
    event.eventType = req.body.eventType;
    event.location = {
        lat: req.body.lat,
        lng: req.body.lng,
    };
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

var checkEventExists = function(req, res, next, callback) {
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

/**
 * POST Add user to an event.
 */
router.post('/:id/users', function(req, res) {
    // TODO
    res.send({
        msg: 'TODO will add a user to an event'
    });
});


// PUT ==========================================

/**
 * PUT Update an event.
 */
router.put('/:id', function(req, res, next) {
    checkEventExists(req, res, next, function(req, res, next) {
        var set = buildPutEventSet(req);
        EventModel.update({
            _id: req.params.id
        }, {
            $set: set
        }, function(err) {
            if (err) {
                return next(err);
            }
            res.status(201).json({
                msg: 'event updated'
            });
        });
    });

});

var buildPutEventSet = function(req) {
    var set = {};
    if (req.body.name !== undefined) {
        set.name = req.body.name;
    }
    if (req.body.eventType !== undefined) {
        set.eventType = req.body.eventType;
    }
    if (req.body.lat !== undefined && req.body.lng !== undefined) {
        set.location = {};
        set.location.lat = req.body.lat;
        set.location.lng = req.body.lng;
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


// DELETE =======================================

/**
 * DELETE Delete an event.
 */
router.delete('/:id', function(req, res) {
    // TODO
    res.send({
        msg: 'TODO will delete an event'
    });
});

/**
 * DELETE Remove a user from an event.
 */
router.post('/:evtId/users/:userId', function(req, res) {
    // TODO
    res.send({
        msg: 'TODO will remove a user from an event'
    });
});


module.exports = router;