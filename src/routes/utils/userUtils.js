var path = require('path');
var UserModel = require(path.join(__dirname, '..', '..', 'models', 'user.js'));
var logger = require(path.join(__dirname, '..', '..','utils', 'logger.js'));
var config = require(path.join(__dirname, '..', '..', 'config', 'config.js'));
var googleAuthUtils = require(path.join(__dirname, '..', 'utils', 'googleAuthUtils.js'));

registerUser = function(req, res, callback) {

    var name = req.body.name;
    var surname = req.body.surname;
    var email = req.body.email;
    var pass = req.body.passwordHash;

    UserModel.findOne({email:email}, function(err, doc) {
        if(err) {
            logger.error("Problem while finding user.");
            return callback(err);
        }

        var user;

        if(doc) {
            // Found user with this email.
            // Checking whether this user was previously authenticated with password or with Google.
            //  If with Google, then adding password credentials and returning the user.
            //  If with password, then error: email-password user already exists.

            if(doc.authentications.local && doc.authentications.local.password) {
                var msg = "User already exists. User email: " + doc.authentications.local.email;
                logger.info(msg);
                return callback(msg, doc);
            }

            if(doc.authentications.google && doc.authentications.google.userId) {
                user = doc;
            }
        } else {
            user = new UserModel();
            user.name = name;
            user.surname = surname;
        }

        user.email = email;
        user.authentications.local.email = email;
        user.authentications.local.password = pass;

        user.save(function(err, doc) {
            if(err) {
                logger.error("Error saving user to db. Possibly required fields missing.");
                return callback(err);
            }

            // Returning the created user
            logger.debug("Saved user: " + doc);
            return callback(null, doc);
        });

    });
};


registerGoogleUser = function(req, res, callback) {

    var name = req.body.name;
    var surname = req.body.surname;
    var token = req.body.token;

    googleAuthUtils.authenticate(token, config.get('auth.client_id'), function(err, login) {
        if(err) {
            return callback(err);
        }

        var email = login.getPayload().email;
        var googleUserId = login.getPayload().sub;

        UserModel.findOne({email:email}, function(err, doc) {
            if(err) {
                logger.error("Problem while finding user with email " + email);
                return callback(err);
            }

            var user;

            if(doc) {
                // Found user with this email.
                // Checking whether this user was previously authenticated with password or with Google.
                //  If with password, then adding Google credentials and returning the user.
                //  If with Google, then error: google user already exists.

                if(doc.authentications.google && doc.authentications.google.userId) {
                    var msg = "Google user already exists. Google userID: " + doc.authentications.google.userId;
                    logger.info(msg);
                    return callback(msg, doc);
                }

                if(doc.authentications.local && doc.authentications.local.password) {
                    user = doc;
                }
            } else {
                user = new UserModel();
                user.name = name;
                user.surname = surname;
            }

            user.email = email;
            user.authentications.google.userId = googleUserId;
            user.authentications.google.email = email;

            user.save(function(err, doc) {
                if(err) {
                    logger.error("Error saving user to db. Possibly required fields missing.");
                    return callback(err);
                }

                // Returning the created user
                logger.debug("New user created: " + doc);
                return callback(null, doc);
            });

        });

    });
};


module.exports.registerUser = registerUser;
module.exports.registerGoogleUser = registerGoogleUser;