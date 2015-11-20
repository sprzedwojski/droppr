/**
 * Author: szymon
 * Creation date: 20.11.15
 * Project: droppr
 */

var express = require('express');
var router = express.Router();

// GET ==========================================

/**
 * GET Details of a user.
 */
router.get('/:id', function(req, res) {
    // TODO
    res.send({msg : 'TODO will return details of a user'});
});


// POST =========================================

/**
 * POST User registration.
 */
router.post('/', function(req, res) {
    // TODO
    res.send({msg : 'TODO will register user'});
});


// PUT ==========================================

router.put('/:id', function(req, res) {
    // TODO
    res.send({msg : 'TODO will update user details'});
});


module.exports = router;