var express = require('express');
var router = express.Router();
var path = require('path');
var EventModel = require(path.join(__dirname, '..','..', '..', 'models', 'event.js'));
var logger = require(path.join(__dirname, '..','..', '..', 'utils', 'logger.js'));
var eventTypeList = require(path.join(__dirname, '..','..', '..', 'models', 'enums', 'eventTypeList.js'));
var async = require('async');
var eventUtils = require(path.join(__dirname, '..','..', 'utils', 'eventUtils.js'));
var statusCodes = require('http-status-codes');
var errorHelper = require(path.join(__dirname, '..', '..', '..', 'utils', 'errorHelper.js')).errorHelper;

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

module.exports = router;