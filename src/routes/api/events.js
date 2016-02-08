var express = require('express');
var router = express.Router();
var path = require('path');
var EventModel = require(path.join(__dirname, '..', '..', 'models', 'event.js'));
var logger = require(path.join(__dirname, '..', '..', 'utils', 'logger.js'));
var eventTypeList = require(path.join(__dirname, '..', '..', 'models', 'enums', 'eventTypeList.js'));
var async = require('async');
var eventUtils = require(path.join(__dirname, '..', 'utils', 'eventUtils.js'));
var statusCodes = require('http-status-codes');
var errorHelper = require(path.join(__dirname, '..', '..', 'utils', 'errorHelper.js')).errorHelper;

/**
 * @api {get} /api/event Get all existing events for a given set of filter params
 * @apiName getEvents
 * @apiGroup Event
 *
 * @apiSuccess (200) {Object[]} events List of events.
 * @apiParam {String} [name] Event name.
 * @apiParam {String} [eventType]  Type of event (sport).
 * @apiParam {Date} [eventTime]  Time of the event.
 * @apiParam {String} [guestCount] Number of participants already registered.
 * @apiParam {Number} [numParticipants]  Target number of participants (between min and max).
 * @apiParam {Number} [lat]  Latitude (always use with lng and tolerance).
 * @apiParam {Number} [lng]  Longitude (always use with lat and tolerance).
 * @apiParam {Number} [tolerance]  Coordinate range to look through (always use with lat and lng).
 *
 * @apiError (500) {String} msg Internal server error
 */
router.get('/', function(req, res, next) {
    console.log("entered");
    eventUtils.createEventFilterDataHolder(req, function(err, data) {
        if (err) {
            return next(errorHelper(err));
        }
        var query = data;
        EventModel.find(query, function(err, events) {
            if (err) {
                logger.error("Error fetching all events.");
                return next(err);
            }
            logger.info(events.length + " events found.");
            return res.status(statusCodes.OK).send(events);
        });
    });
});


/**
 * @api {get} /api/event/types Get all existing event types
 * @apiName getEvents
 * @apiGroup Event
 *
 * @apiSuccess (200) {String} eventTypeList List of all existing events.
 *
 */
router.get('/types', function(req, res, next) {
    logger.info("Returning all event types.");
    res.send(eventTypeList);
});

/**
 * @api {get} /api/event/:id Get event by ID
 * @apiName getEventById
 * @apiGroup Event
 *
 * @apiSuccess (200) {Object} event Event object.
 *
 * @apiError (500) {String} msg Internal server error
 */
router.get('/:id', function(req, res, next) {
    EventModel.findById(req.params.id, function(err, doc) {
        if (err) {
            return next(err);
        }
        res.status(statusCodes.OK).json(doc);
    });
});



/**
 * @api {get} /api/event/:id/participants Get event participants
 * @apiName getEventParticipants
 * @apiGroup Event
 *
 * @apiSuccess (200) {Object[]} participants List of user objects participating in the event (host + guests)
 *
 * @apiError (500) {String} msg Internal server error
 */
router.get('/:id/participants', function(req, res, next) {
    EventModel.findById(req.params.id)
        .populate('host guests')
        .exec(function(err, doc) {
            if (err) {
                return next(err);
            }
            var participants = eventUtils.buildGetParticipantsJSON(doc);
            res.status(statusCodes.OK).json(participants);
        });
});



/**
 * @api {post} /api/event Create a new event.
 * @apiName addEvent
 * @apiGroup Event
 *
 * @apiParam {String} name Event name.
 * @apiParam {String} eventType  Type of event (sport).
 * @apiParam {Number} lat Latitude of the event coords.
 * @apiParam {Number} lng Longitude of the event coords.
 * @apiParam {Date} eventTime  Time of the event.
 * @apiParam {String} host ID of the user hosting the event.
 * @apiParam {String} [guests] IDs of event registered guests.
 * @apiParam {Number} [minParticipants]  Minimum number of participants required for the event.
 * @apiParam {Number} [maxParticipants] Minimum number of participants required for the event.
 *
 *
 * @apiSuccess (201) {String} msg Event created
 * @apiError (500) {String} msg Internal server error
 */
router.post('/', function(req, res, next) {

    logger.info("BODY:");
    logger.info(req.body);

    var event = eventUtils.parsePostEventFields(req);
    event.save(function(err) {
        if (err) {
            return next(err);
        }
        res.status(statusCodes.CREATED).json(event);
    });

});



/**
 * @api {post} /api/event/:id Modify an existing event.
 * @apiName modifyEvent
 * @apiGroup Event
 *
 * @apiParam {String} [name] Event name.
 * @apiParam {String} [eventType]  Type of event (sport).
 * @apiParam {Number} [lat] Latitude of the event coords.
 * @apiParam {Number} [lng] Longitude of the event coords.
 * @apiParam {Date}   [eventTime]  Time of the event.
 * @apiParam {String} [host ID] of the user hosting the event.
 * @apiParam {String} [guests] IDs of event registered guests.
 * @apiParam {Number} [minParticipants]  Minimum number of participants required for the event.
 * @apiParam {Number} [maxParticipants] Minimum number of participants required for the event.
 *
 *
 * @apiSuccess (200) {String} msg Event modified
 * @apiError (500) {String} msg Internal server error
 */
router.put('/:id', function(req, res, next) {
    eventUtils.checkEventExists(req, res, next, function(req, res, next) {
        var set = eventUtils.buildPutEventSet(req);
        EventModel.update({
            _id: req.params.id
        }, {
            $set: set
        }, function(err) {
            if (err) {
                return next(err);
            }
            res.status(statusCodes.OK).json({
                msg: 'event updated'
            });
        });
    });

});



/**
 * @api {post} /api/event/:id/users Add a user to an existing event
 * @apiName addParticipantToEvent
 * @apiGroup Event
 *
 * @apiParam {String} id ID of the event to add to
 * @apiParam {String} _id ID of the user to add
 *
 *
 * @apiSuccess (200) {String} msg Event modified
 * @apiError (400) {String} msg Invalid request data
 * @apiError (404) {String} msg User/event not found
 * @apiError (500) {String} msg Internal server error
 */
router.put('/:id/users', function(req, res, next) {

    logger.info("BODY:");
    logger.info(req.body);

    //var user = req.body.user;
    var userId = req.body._id;

    logger.info("userId: " + userId);

    if (userId === null) {
        logger.error("User ID is null.");
        return res.status(statusCodes.BAD_REQUEST).json({
            msg: "User ID is missing"
        });
    }

    async.waterfall([
        function(callback) {
            return eventUtils.checkIfUserExists(req, callback);
        },
        function(userExists, callback) {
            return eventUtils.addUserToEvent(userExists, req, callback);
        }
    ], function(err, result) {
        if (err) {
            logger.error("Error adding user to event.");
            return next(err);
        }
        logger.info(result.status + " " + result.message);
        return res.status(result.status).json(result.message);
    });

});



/**
 * @api {post} /api/event/:id/users/:userId Add a user to an existing event
 * @apiName removeParticipantFromEvent
 * @apiGroup Event
 *
 * @apiParam {String} id ID of the event to remove from
 * @apiParam {String} _id ID of the user to remove
 *
 *
 * @apiSuccess (200) {String} msg Event modified
 * @apiError (400) {String} msg Invalid request data
 * @apiError (404) {String} msg User/event not found
 * @apiError (500) {String} msg Internal server error
 */
router.put('/:id/users/:userId', function(req, res, next) {
    eventUtils.checkEventExists(req, res, next, function(req, res, next) {
        EventModel.update({
            _id: req.params.id
        }, {
            $pull: {
                guests: req.params.userId
            }
        }, function(err) {
            if (err) {
                return next(err);
            }
            res.status(statusCodes.OK).json({
                msg: 'participant removed'
            });
        });
    });
});


module.exports = router;