/* jshint node: true */


/**
 * Author: szymon
 * Creation date: 06.12.15
 * Project: droppr
 */

var express = require('express');
var router = express.Router();
var path = require('path');
var logger = require(path.join(__dirname, '..', '..', 'utils', 'logger.js'));
var config = require(path.join(__dirname, '..', '..', 'config', 'config.js'));
var googleAuthUtils = require(path.join(__dirname, '..', 'utils', 'googleAuthUtils.js'));
var statusCodes = require('http-status-codes');

var CLIENT_ID = config.get('auth.client_id');


var postTokenSignIn = function(req,res,next) {
    var token = req.body.token;
    if(!token) {
        return next("Token is missing from request parameters.");
    }
    googleAuthUtils.authenticate(token, CLIENT_ID, function(err, login) {
        if(err) {
            return next(err);
        }
        logger.info("Ending tokensignin");
        res.status(statusCodes.OK).json({msg: "Authenticated", "login": login.getPayload()});
    });
};


/**
 * @api {post} /api/tokensignin Authenticate with the Google API token
 * @apiName postTokenSignIn
 * @apiGroup Google
 *
 * @apiParam {String} token Google auth. token to authenticate with.
 *
 *
 * @apiSuccess (200) {String} msg Authentication successful
 * @apiError (500) {String} msg Internal server error
 */
router.post('/tokensignin', postTokenSignIn);

module.exports = router;


