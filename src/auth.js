/* jshint node: true */

var auth = require('basic-auth');
var path = require('path');
var UserModel = require(path.join(__dirname, 'models', 'user.js'));
var logger = require(path.join(__dirname, 'utils', 'logger.js'));
var config = require(path.join(__dirname, 'config', 'config.js'));
var googleAuthUtils = require(path.join(__dirname, 'routes', 'utils', 'googleAuthUtils.js'));


function returnUnauthorised(res) {
    console.log("returning 401");
    res.set('WWW-Authenticate', 'Basic realm="example"');
    return res.status(401).send({msg: 'Authenticate with a valid username and hashed password'});
}

module.exports = function(req, res, next) {
    logger.debug("*** Beginning authorisation. ***");

    var authUser = auth(req);
    if(!authUser) {
        logger.error("No user in the header.");
        return returnUnauthorised(res);
    }

    UserModel.findOne({email:authUser.name}, function(err, doc){

        if(err) {
            logger.error("Authentication error [email: " + authUser.name + "]");
            return returnUnauthorised(res);
        }

        if(doc === null || doc.length === 0) {
            logger.warn("No user found in the database [email: " + authUser.name + "]");
            return returnUnauthorised(res);
        }

        // FIXME
        // Arbitrarily setting password max length to 20 -> if longer, we assume it is a Google token
        // Prone to errors, to be corrected in the future
        // POC Google
        if(authUser.pass.length > 20) {
            // Google sign-in path

            var token = authUser.pass;

            googleAuthUtils.authenticate(token, config.get('auth.test_client_id'), function(err, login) {
                if(err) {
                    return next(err);
                }

                logger.info("Google user authorised [email: " + doc.email + "]");
                return next();
            });
        } else {
            // Email-password path

            if(doc.authentications.local.password == authUser.pass) {
                logger.info("User authorised [email: " + doc.email + "]");
                return next();
            } else {
                logger.error("Wrong password.");
                return returnUnauthorised(res);
            }
        }

    });

};
