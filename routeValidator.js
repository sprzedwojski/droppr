var path = require('path');
var validator = require(path.join(__dirname, 'src', 'utils', 'validator.js'));
var errorCodes = require(path.join(__dirname, 'errorCodes.js'));
var statusCodes = require(path.join('http-status-codes'));



module.exports.validateRoutes = function(app) {
	var handlePathParam = function(req, res, next, name) {
		if (validator.isValid(name) && !validator.isValidId(name)) {
			return next(statusCodes.BAD_REQUEST);
		}
		next();
	};
	app.param('id', handlePathParam);
};