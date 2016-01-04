/* jshint node: true */

/**
 * Author: szymon
 * Creation date: 20.11.15
 * Project: droppr
 */

var path = require('path');
var express = require('express');
var router = express.Router();
var logger = require(path.join(__dirname, '..', '..','utils', 'logger.js'));
var statusCodes = require('http-status-codes');
var userUtils = require(path.join(__dirname, '..', 'utils', 'userUtils.js'));
var authMethods = ["email", "google"];

/**
 * POST User registration.
 */
router.post('/', function(req,res,next) {
    logger.info("Inside POST User registration.");
    logger.info(req.body);
    logger.info("index: " + authMethods.indexOf(req.body.authMethod));

    // Check if the authentication method is specified
    if(authMethods.indexOf(req.body.authMethod) < 0) {
        return res.status(400)
            .json({msg:"Wrong authentication method provided. Must be one of the following: [" + authMethods + "]"});
    }

    if(req.body.authMethod == "google") {
        userUtils.registerGoogleUser(req.body.name, req.body.surname, req.body.token, function (err, user) {
            if (err) {
                return next(err);
            }

            // Returning the created user
            logger.debug("New user created: " + doc);
            return res.status(statusCodes.CREATED).json(user);
        });
    } else {
        userUtils.registerUser(req.body.name, req.body.surname, req.body.email, req.body.passwordHash, function (err, user) {
            if (err) {
                return next(err);
            }
            if (user === null) {
                return res.status(401).json({msg: "User email already taken."});
            }

            return res.status(201).send(user);
        });
    }

});

module.exports = router;