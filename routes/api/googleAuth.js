/**
 * Author: szymon
 * Creation date: 06.12.15
 * Project: droppr
 */

var express = require('express');
var router = express.Router();
var path = require('path');
var logger = require(path.join(__dirname, '..', '..', 'utils', 'logger.js'));

var TEST_CLIENT_ID = "407408718192.apps.googleusercontent.com";

// "Node DEV" in Google Developer Console
var NODE_DEV_CLIENT_ID = "24532706524-aopb1njpu7mraqtlp9a8qbso3fltrns7.apps.googleusercontent.com";

router.post('/tokensigninTest', function(req,res,next) {
    var token = req.body.token;
    if(!token) {
        return next("Token is missing from request parameters.");
    }

    authenticate(token, TEST_CLIENT_ID, function(err, login) {
        if(err) {
            return next(err);
        }

        logger.info("Ending tokensignin test");

        res.status(200).json({msg: "Authenticated", "login": login.getPayload()});
    })

});

router.post('/tokensignin', function(req,res,next) {
    var token = req.body.token;
    if(!token) {
        return next("Token is missing from request parameters.");
    }

    authenticate(token, NODE_DEV_CLIENT_ID, function(err, login) {
        if(err) {
            return next(err);
        }

        logger.info("Ending tokensignin");

        res.status(200).json({msg: "Authenticated", "login": login.getPayload()});
    })

});

var authenticate = function(token, audience, callback) {
    logger.info("Inside authenticate");
    var GoogleAuth = require('google-auth-library');

    // Get the environment configured authorization
    (new GoogleAuth).getApplicationDefault(function(err, authClient) {
        if (err === null) {
            // Inject scopes if they have not been injected by the environment
            if (authClient.createScopedRequired && authClient.createScopedRequired()) {
                var scopes = [
                    'https://www.googleapis.com/auth/cloud-platform',
                    'https://www.googleapis.com/auth/compute'
                ];
                authClient = authClient.createScoped(scopes);
            }

            authClient.verifyIdToken(token, audience, callback);

/*            var optionalUri = null;  // optionally specify the URI being authorized
            var reqHeaders = {};
            authClient.getRequestMetadata(optionalUri, function(err, headers) {
                if (err === null) {
                     // Use authorization headers
                    reqHeaders = _.merge(allHeaders, headers);
                    logger.info("AUTH: reqHeaders: " + reqHeaders);
                    callback(true);
                }
                logger.info("AUTH: false");
                callback(false);
            });*/
        } else {
            callback(err);
        }
    });
};

module.exports = router;


