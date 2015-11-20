/* jshint node: true */

/**
 * Author: szymon
 * Creation date: 20.11.15
 * Project: droppr
 */

var express = require('express');
var router = express.Router();


// GET ==========================================

/**
 * GET All events.
 */
router.get('/', function(req, res) {
    // TODO
    res.send({msg : 'TODO will return all events and their basic info'});
});

/**
 * GET Details of an event.
 */
router.get('/:id', function(req, res) {
    // TODO
    res.send({msg : 'TODO will return details of an event'});
});

/**
 * GET Participants of an event.
 */
router.get('/:id/participants', function(req, res) {
    // TODO
    res.send({msg : 'TODO will return all participants of an event'});
});

/**
 * GET List of event types.
 */
router.get('/types', function (res, req) {
    // TODO
    res.send({msg : 'TODO will return list of all event types'});
});


// POST =========================================

/**
 * POST Create a new event.
 */
router.post('/', function(req, res) {
    // TODO
    res.send({msg : 'TODO will create a new event'});
});

/**
 * POST Add user to an event.
 */
router.post('/:id/users', function(req, res) {
    // TODO
    res.send({msg : 'TODO will add a user to an event'});
});


// PUT ==========================================

/**
 * PUT Update an event.
 */
router.put('/:id', function(req, res) {
    // TODO
    res.send({msg : 'TODO will update an event'});
});


// DELETE =======================================

/**
 * DELETE Delete an event.
 */
router.post('/:id', function(req, res) {
    // TODO
    res.send({msg : 'TODO will delete an event'});
});

/**
 * DELETE Remove a user from an event.
 */
router.post('/:evtId/users/:userId', function(req, res) {
    // TODO
    res.send({msg : 'TODO will remove a user from an event'});
});


module.exports = router;