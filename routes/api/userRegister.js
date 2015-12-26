/* jshint node: true */

/**
 * Author: szymon
 * Creation date: 20.11.15
 * Project: droppr
 */

var path = require('path');
var express = require('express');
var router = express.Router();
var UserModel = require(path.join(__dirname, '..', '..', 'models', 'user.js'));
var logger = require(path.join(__dirname, '..', '..','utils', 'logger.js'));

/**
 * POST User registration.
 */
router.post('/', function(req, res, next) {
    logger.info("Inside POST User registration.");
    logger.info(req.body);

    var name = req.body.name;
    var surname = req.body.surname;
    var email = req.body.email;
    var pass = req.body.passwordHash;

    UserModel.findOne({email:email}, function(err, doc) {
         if(err) {
             logger.error("Problem while finding user.");
             return next(err);
         }

        if(doc) {
            logger.error("User email already taken.");
            return res.status(401).json({msg:"User email already taken."});
        }

        var user = new UserModel();
        user.name = name;
        user.surname = surname;
        user.email = email;
        user.passwordHash = pass;
        user.save(function(err, doc) {
            if(err) {
                logger.error("Error saving user to db. Possibly required fields missing.");
                return next(err);
            }

            // Returning the created user
            logger.debug("New user created: " + doc);
            return res.status(201).send(doc);
        });

    });

});

module.exports = router;