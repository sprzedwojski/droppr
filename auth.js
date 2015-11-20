/**
 * Author: szymon
 * Creation date: 20.11.15
 * Project: droppr
 */

var auth = require('basic-auth');
var path = require('path');
var UserModel = require(path.join(__dirname, 'models', 'user.js'));


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

    UserModel.findOne({email:authUser.name}, function(err, doc){
        console.log("finished searching for user");

        if(err) {
            //TODO
            console.log("authentication error");
            return returnUnauthorised(res);
        }

        if(doc.length === 0) {
            // TODO
            // brak usera
            console.log("no user found");
            return returnUnauthorised(res);
        }

        console.log("doc: " + doc);
        console.log(doc.email);
        console.log(">> password from db: " + doc.password);

        if(doc.password == authUser.pass) {
            console.log("user authorised");
            return next();
        } else {
            // TODO
            // złe hasło
            console.log("wrong password");
            return returnUnauthorised(res);
        }
    });

};
