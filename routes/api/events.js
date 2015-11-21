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

// GET ==========================================

/**
 * GET All events.
 */
router.get('/', function(req, res) {
    // TODO
    res.send({
        msg: 'TODO will return all events and their basic info'
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
        res.status(200).json(buildGetParticipantsJSON(doc));
    });
});


var buildGetParticipantsJSON = function(doc){
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
    // TODO
    res.send({
        msg: 'TODO will return list of all event types'
    });
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
router.put('/:id', function(req, res) {
    // TODO
    res.send({
        msg: 'TODO will update an event'
    });
});


// DELETE =======================================

/**
 * DELETE Delete an event.
 */
router.post('/:id', function(req, res) {
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