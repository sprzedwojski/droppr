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

// "Node DEV" in Google Developer Console
var NODE_DEV_CLIENT_ID = config.get('auth.node_dev_client_id');

// OAuth 2.0 Playground
var TEST_CLIENT_ID = config.get('auth.test_client_id');


var postTokenSignIn = function(req,res,next) {
    var token = req.body.token;
    if(!token) {
        return next("Token is missing from request parameters.");
    }

    googleAuthUtils.authenticate(token, NODE_DEV_CLIENT_ID, function(err, login) {
        if(err) {
            return next(err);
        }

        logger.info("Ending tokensignin");

        res.status(200).json({msg: "Authenticated", "login": login.getPayload()});

    });
};


var postTokenSignInTest = function(req,res,next) {
    var token = req.body.token;
    if(!token) {
        return next("Token is missing from request parameters.");
    }

    googleAuthUtils.authenticate(token, TEST_CLIENT_ID, function(err, login) {
        if(err) {
            return next(err);
        }

        logger.info("Ending tokensignin test");

        res.status(200).json({msg: "Authenticated", "login": login.getPayload()});
    });
};





router.post('/tokensignin', postTokenSignIn);
router.post('/tokensigninTest', postTokenSignInTest);

module.exports = router;


