/**
 * Author: szymon
 * Creation date: 20.11.15
 * Project: droppr
 */

var path = require('path');
var express = require('express');
var router = express.Router();
var UserModel = require(path.join(__dirname, '..', '..', 'models', 'user.js'));

/**
 * POST User registration.
 */
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

module.exports = router