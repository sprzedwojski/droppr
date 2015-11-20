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
    var user = UserModel.findById(userId, function(err, doc) {
        if(err) {
            console.log("error finding user by id");
            return next(err);
        }

        res.send(doc);
    });

    //res.send({msg : 'TODO will return details of a user'});
});


// POST =========================================

/**
 * POST User registration.
 */
/*
router.post('/', function(req, res, next) {
    // TODO
    var name = "Szymon";
    var surname = "Przedwojski";
    var email = "szym1000@gmail.com";
    var pass = "superpass";

    var user = new UserModel();
    user.name = name;
    user.surname = surname;
    user.email = email;
    user.password = pass;
    user.save(function(err) {
        if(err) {
            // TODO handle error
            console.log("error saving user to db");
            return next(err);
        }

        res.send({msg : 'User registered.'});
    });
});
*/


// PUT ==========================================

router.put('/:id', function(req, res) {
    // TODO
    res.send({msg : 'TODO will update user details'});
});

module.exports = router;