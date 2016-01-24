var path = require('path');
var express = require('express');
var router = express.Router();
var logger = require(path.join(__dirname, '..', '..', 'utils', 'logger.js'));
var statusCodes = require('http-status-codes');
var userUtils = require(path.join(__dirname, '..', 'utils', 'userUtils.js'));
var authMethods = ["email", "google"];

/**
 * @api {post} /api/user Register new user
 * @apiName userRegister
 * @apiGroup User
 *
 * @apiParam {enum} authMethod User's authentication method
 * @apiParam {String} [email] User's email
 * @apiParam {String} [name] User's name
 * @apiParam {String} [surname] User's surname
 * @apiParam {String} [token] User's google token
 *
 * @apiSuccess (201) {String} msg User created
 * @apiSuccess (302) {String} msg User already exists
 * @apiError (400) {String} msg Incorrect data provided
 * @apiError (500) {String} msg Internal server error
 */
router.post('/', function(req, res, next) {
    logger.info("Inside POST User registration.");
    logger.info(req.body);
    logger.info("index: " + authMethods.indexOf(req.body.authMethod));

    // Check if the authentication method is specified
    if (authMethods.indexOf(req.body.authMethod) < 0) {
        return res.status(statusCodes.BAD_REQUEST)
            .json({
                msg: "Wrong authentication method provided. Must be one of the following: [" + authMethods + "]"
            });
    }

    var callbackHandler = new CallbackHandler(req, res, next);

    if (req.body.authMethod == "google") {
        userUtils.registerGoogleUser(req, res, callbackHandler.userRegistrationCallback);
    } else {
        userUtils.registerUser(req, res, callbackHandler.userRegistrationCallback);
    }

});

var CallbackHandler = function(req, res, next) {
    this.userRegistrationCallback = function(err, user) {
        if (err) {
            if (!user) {
                return next(err);
            }
            // Existing user found
            return res.status(statusCodes.MOVED_TEMPORARILY).json(user);
        }
        // Returning the created user
        logger.debug("New user created: " + user);
        return res.status(statusCodes.CREATED).json(user);
    };
};

module.exports = router;