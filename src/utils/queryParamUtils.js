var path = require('path');
var validator = require(path.join(__dirname, 'validator.js'));
var errorCodes = require(path.join(__dirname,  '..', '..', 'errorCodes.js'));



module.exports.handleTimeFrameQueryParam = function(req){
	var query = {};
	if(validator.isValid(req.query.timeFrom)){
		query.$gte = req.query.timeFrom;
	}
	if(validator.isValid(req.query.timeTo)){
		query.$lte = req.query.timeTo;
	}
	return query;
};

