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
var logger = require(path.join(__dirname, '..', '..', 'utils', 'logger.js'));
var eventTypeList = require(path.join(__dirname, '..', '..', 'models', 'enums', 'eventTypeList.js'));
var async = require('async');
var eventUtils = require(path.join(__dirname, '..', 'utils', 'eventUtils.js'));

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
 * GET List of event types.
 */
router.get('/types', function(req, res) {
    logger.info("Returning all event types.");
    res.send(eventTypeList);
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
            var participants = eventUtils.buildGetParticipantsJSON(doc);
            res.status(200).json(participants);
        });
});





// POST =========================================

/**
 * POST Create a new event.
 */
router.post('/', function(req, res, next) {

    logger.info("BODY:");
    logger.info(req.body);

    var event = eventUtils.parsePostEventFields(req);
    event.save(function(err) {
        if (err) {
            return next(err);
        }
        res.status(201).json(event);
    });

});




// PUT ==========================================

/**
 * PUT Update an event.
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
            res.status(201).json({
                msg: 'event updated'
            });
        });
    });

});



/**
 * PUT Add user to an event.
 */
router.put('/:id/users', function(req, res, next) {

    logger.info("BODY:");
    logger.info(req.body);

    //var user = req.body.user;
    var userId = req.body._id;

    logger.info("userId: " + userId);

    if(userId === null) {
        logger.error("User ID is null.");
        return res.status(400).json({
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
 * DELETE Remove a user from an event.
 */
router.put('/:id/users/:userId', function(req, res, next) {
    eventUtils.checkEventExists(req, res, next, function(req, res, next){
        EventModel.update({_id: req.params.id}, {$pull: {guests: req.params.userId}}, function(err){
            if (err) {
                return next(err);
            }
            res.status(201).json({
                msg: 'participant removed'
            });
        });
    });
});


module.exports = router;