/* jshint node: true */
var express = require('express');
var path = require('path'); //is it necessary?
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var auth = require('basic-auth');

// Routes
var users = require('./routes/api/users');


var mongoose = require('mongoose');
var config = require(path.join(__dirname, 'config', 'config.js'));

var app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

mongoose.connect(config.get('db.protocol') + '://' +
    config.get('db.hostname') + ':' +
    config.get('db.port') + '/' +
    config.get('db.name')
);

// ROUTES =======================================

// Unauthenticated middleware
// TODO



// ==============================================
mongoose.connection.on('open', function() {
    console.log('Connected to db');

    app.use(auth);
    // Authenticated middleware
    app.use('/api/users', users);

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

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
        res.status(err.status || 500).json({
            msg: "error test"
        });
    });
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
        msg: "error test prod"
    });
});



module.exports = app;