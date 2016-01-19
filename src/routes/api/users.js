/* jshint node: true */
var path = require('path');
var express = require('express');
var router = express.Router();
var UserModel = require(path.join(__dirname, '..', '..', 'models', 'user.js'));
var logger = require(path.join(__dirname, '..', '..', 'utils', 'logger.js'));
var statusCodes = require('http-status-codes');

/**
 * @api {get} /api/user/:id Request user information
 * @apiName getUserById
 * @apiGroup User
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess (200) {String} name Firstname of the User.
 * @apiSuccess (200) {String} surname  Lastname of the User.
 * @apiSuccess (200) {String} email Email of the User.
 * @apiError (500) {String} msg Internal server error
 */
router.get('/:id', function(req, res, next) {
    var userId = req.params.id;
    UserModel.findById(userId, function(err, user) {
        if(err) {
            return next(err);
        }
        if(!user) {
            //TODO this should be handled in a generic way in the error handler
            logger.error("User with id " + userId + " not found.");
            return res.status(statusCodes.NOT_FOUND).json({msg: "User not found."});
        }
        return res.status(statusCodes.OK).json(user);
    });
});


module.exports = router;