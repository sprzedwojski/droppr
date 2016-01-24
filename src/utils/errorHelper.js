var path = require('path');
var util = require('util');
var statusCodes = require('http-status-codes');

var messages = {
    'required': "Field \'%s\' is required.",
    'min': "%s below minimum.",
    'max': "%s above maximum.",
    'enum': "%s not an allowed value.",
    'regexp': "Invalid %s"
};

exports.errorHelper = function errorHelper(err) {
    if (err.name === 'ValidationError' && err.isMailchimp) {
        return {
            error: err.name,
            status : statusCodes.BAD_REQUEST,
            message: err.error
        };
    } else if (err.name === 'ValidationError') {
        var errors = [];
        Object.keys(err.errors).forEach(function(field) {
            var eObj = err.errors[field];
            if (!messages.hasOwnProperty(eObj.properties.type)) {
                errors.push(eObj.properties.type);
            } else {
                errors.push(util.format(messages[eObj.properties.type], eObj.path));
            }
        });
        errors.status = statusCodes.BAD_REQUEST;
        return errors;

    } else if (err.name == 'CastError') {
        var castError = {};
        castError.status = statusCodes.BAD_REQUEST;
        castError.message = err.message;
        return castError;

    } else if (err.name == 'PassportError') {
        var passportError = {};
        passportError.status = err.response.status;
        passportError.message = err.info;
        return passportError;

    } else if (err.status == "400" || err.status == "401"  || err.status == "403" ||  err.status == "404" ) {
        var error = {};
        error.status = err.status;
        error.message = err.message;
        return error;
    } else {
        var rawError = {
            error: err,
            status: statusCodes.BAD_REQUEST
        };
        if (err.status !== null && err.status !== undefined) {
            rawError = err.status;
        }
        return rawError;
    }
};