var createError = function(code) {
	return code;
};

module.exports = {
	// purchasing errors
	invalidEventType: createError('invalidEventType'),
	invalidGuestCountFormat: createError('invalidGuestCountFormat'),
	invalidNumParticipantsFormat: createError('invalidNumParticipantsFormat'),
	invalidDates: createError('invalidDates')
};