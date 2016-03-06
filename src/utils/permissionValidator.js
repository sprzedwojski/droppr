var path = require('path');

module.exports.canEditUser = function(loggedInUser, userId){
	return isAdmin(loggedInUser) || isMe(loggedInUser._id, userId);
};


var isAdmin = function(loggedInUser){
	return loggedInUser.role === "admin";
};


var isMe = function(loggedInUserId, userId){
	return loggedInUserId === userId;
};