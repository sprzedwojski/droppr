var express = require('express');
var path = require('path');
var logger = require(path.join(__dirname, 'src', 'utils', 'logger.js'));
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var statusCodes = require('http-status-codes');

var https = require('https');
var fs = require('fs');

var auth = require(path.join(__dirname, 'src', 'auth.js'));

var users = require(path.join(__dirname, 'src', 'routes','api','users'));
var userRegister = require(path.join(__dirname, 'src', 'routes','api','userRegister.js'));
var googleAuth = require(path.join(__dirname, 'src', 'routes','api','googleAuth'));
var events = require(path.join(__dirname, 'src', 'routes','api','events'));

var routeValidator = require(path.join(__dirname, 'routeValidator.js'));
var mongoose = require('mongoose');
var config = require(path.join(__dirname, 'src', 'config', 'config.js'));
var app = express();

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

    routeValidator.validateRoutes(app);

    // Unauthenticated middleware
    app.use('/api', googleAuth);
    app.use('/api/users', userRegister);

    app.use(auth);

    // Authenticated middleware
    app.use('/api/users', users);
    app.use('/api/events', events);

    // ==============================================

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
             //TODO 
            logger.error(err);
            if (err !== undefined && err.status !== undefined && err !== null && err.status !== null) {
                res.status(err.status).json({
                    errors: err
                });
            } else {
                res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                    errors: 'The submitted request had an error, check your data.',
                    note: 'Missing error handler for this usecase'
                });
            }
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
         //TODO 
        logger.error(err);
        res.status(err.status || statusCodes.INTERNAL_SERVER_ERROR).json({
            msg: err.toString()
        });
    });


    /**
     * Create HTTPS server
     */
    var options = {
        key  : fs.readFileSync('ssl/key.pem'),
        ca   : fs.readFileSync('ssl/csr.pem'),
        cert : fs.readFileSync('ssl/cert.pem')
    };
    var server = https.createServer(options, app);
    server.listen(config.get('server.port'));


    logger.info('Application running on: ' + config.get('server.port'));
    logger.info('Run mode: ' + app.get('env'));
});

module.exports = app;
