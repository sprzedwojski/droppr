var _ = require('lodash');
var path = require('path');
var logger = require(path.join(__dirname, 'logger.js'));

var isValid = module.exports.isValid = function(input) {
	var result = !_.isNull(input) && !_.isUndefined(input);
	if (input instanceof Array) {
		result = result  && !_.isEmpty(input);
	}
	return result;
};

var isValidNaturalNumber = module.exports.isValidNaturalNumber = function(value) {
	return parseInt(value) == parseFloat(value) && (parseInt(value) >= 0);
};

var isNumeric = module.exports.isNumeric = function(value) {
	return !isNaN(parseFloat(value)) && isFinite(value);
};

var isInt = module.exports.isInt = function(value) {
	return Number(value) === value && value % 1 === 0;
};

var isInRange = module.exports.isInRange = function(value, min, max) {
	var number = parseInt(value);
	return isValidNaturalNumber(number) && (number >= min && number <= max);
};

var isValidId = module.exports.isValidId = function(id) {
	if (!isValid(id)) {
		return false;
	}
	try {
		var value = id.match(/^[0-9a-fA-F]{24}$/);
		if (isValid(value)) {
			return false;
		} else {
			return true;
		}
	} catch (ex) {
		return false;
	}
};

var isDateTimeRangeValid = module.exports.isDateTimeRangeValid = function(date1, date2) {
	if (!isValid(date1) || !isValid(date2)) {
		logger.error('One of the specified dates is null or undefined');
		return false;
	}
	var dateTime1 = new Date(date1);
	var dateTime2 = new Date(date2);
	return dateTime1 <= dateTime2;
};


module.exports.isValidBool = function(value) {
	return value === false || value === true;
};


module.exports.isValidEmail = function(email) {
	var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	return regex.test(email);
};



var checkRecordExists = module.exports.checkRecordExists = function(model, query, errorCode, callback) {
	model.count(query, function(err, c) {
		if (err) {
			return callback(err);
		} else if (c === 0) {
			return callback(errorCode);
		} else {
			return callback(null);
		}
	});
};

var isTimeRangeCommon = module.exports.isTimeRangeCommon = function(date1, date2) {

	var newStartTime = new Date(date1.timeFrom);
	var newEndTime = new Date(date1.timeTo);
	var oldStartTime = new Date(date2.timeFrom);
	var oldEndTime = new Date(date2.timeTo);

	return newStartTime < oldEndTime && oldStartTime < newEndTime;
};