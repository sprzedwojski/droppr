/* jshint node: true */

// External modules
var express = require('express');
var path = require('path');
var logger = require(path.join(__dirname, 'utils', 'logger.js'));
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var auth = require('./auth');

// Routes
var users = require('./routes/api/users');
var userRegister = require('./routes/api/userRegister');
var googleAuth = require('./routes/api/googleAuth');
var events = require('./routes/api/events');


var mongoose = require('mongoose');
var config = require(path.join(__dirname, 'config', 'config.js'));

var app = express();
var logger = require(path.join(__dirname, 'utils', 'logger.js'));

mongoose.connect(config.get('db.protocol') + '://' +
    config.get('db.hostname') + ':' +
    config.get('db.port') + '/' +
    config.get('db.name')
);


mongoose.connection.on('open', function() {
    logger.info("Connected to the db");


    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));



    // Unauthenticated middleware
    app.use('/api', googleAuth);
    app.use('/api/users', userRegister);

    app.use(auth);

    // Authenticated middleware
    app.use('/api/users', users);
    app.use('/api/events', events);

    // ==============================================

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });


    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            console.log(err);
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        console.log(err);
        res.status(err.status || 500).json({
            msg: err.toString()
        });
    });

    app.listen(config.get('server.port'));
    logger.info('Application running on: ' + config.get('server.port'));
    logger.info('Run mode: ' + app.get('env'));
});



module.exports = app;