/**
 * Author: szymon
 * Creation date: 20.11.15
 * Project: droppr
 */

var auth = require('basic-auth');

//var admins = {
//    'szymon@test.com': {password: 'pass'}
//};

//var credentials = [
//    {
//        email: 'szymon@test.com',
//        password: 'pass'
//    }
//];

function returnUnauthorised(res) {
    console.log("returning 401");
    res.set('WWW-Authenticate', 'Basic realm="example"');
    return res.status(401).send({msg: 'Authenticate with a valid username and hashed password'});
};

module.exports = function(req, res, next) {
    var authUser = auth(req);
    if(!authUser) {
        console.log(">> no user in the header");
        return returnUnauthorised(res);
    }

    console.log("carrying on...");

    var users = req.db.get('api.users');
    var dbUser = null;
    users.find({ 'email' : authUser.name }, {}, function(e, docs) {
        console.log("error: " + e);
        console.log("docs: " + docs);

        // Checking if any user was found
        if(docs.length) {
            dbUser = docs[0];

            console.log(dbUser);
            console.log("email: " + dbUser.email);
            console.log("pass : " + dbUser.password);
        }

        if(!dbUser || dbUser.password !== authUser.pass) {
            console.log('inside if');
            return returnUnauthorised(res);
        }
        return next();
    });



    //var dbUser = credentials.filter(function ( obj ) {
    //    return obj.email === authUser.name;
    //})[0];

    //if(!user || !admins[user.name] || admins[user.name].password !== user.pass) {

};
