/* jshint node: true */

var path = require('path');
var logger = require(path.join(__dirname, '..', '..', 'utils', 'logger.js'));

module.exports.authenticate = function(token, audience, callback) {
    logger.info("Inside authenticate");
    var GoogleAuth = require('google-auth-library');

    // Get the environment configured authorization
    (new GoogleAuth()).getApplicationDefault(function(err, authClient) {
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

        } else {
            callback(err);
        }
    });
};