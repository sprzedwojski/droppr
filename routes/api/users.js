/**
 * Author: szymon
 * Creation date: 20.11.15
 * Project: droppr
 */

var express = require('express');
var router = express.Router();

/**
 * GET All users
 */
router.get('/', function(req, res) {
    res.send({msg : 'TODO will display all users'});
});

module.exports = router;