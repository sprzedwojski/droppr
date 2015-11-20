/**
 * Author: szymon
 * Creation date: 20.11.15
 * Project: droppr
 */
/* jshint node: true */
var path = require('path');
var express = require('express');
var router = express.Router();
var UserModel = require(path.join(__dirname, '..', '..', 'models', 'user.js'));

// GET ==========================================
/* jshint node: true */
/**
 * GET Details of a user.
 */
router.get('/:id', function(req, res, next) {
    var userId = req.params.id;
    UserModel.findById(userId, function(err, doc) {
        if(err) {
            console.log("error finding user by id");
            return next(err);
        }

        res.send(doc);
    });
});



// PUT ==========================================

router.put('/:id', function(req, res) {
    // TODO
    res.send({msg : 'TODO will update user details'});
});

module.exports = router;