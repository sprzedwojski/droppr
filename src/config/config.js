var path = require('path');
var nconf = require('nconf');
var logger = require(path.join(__dirname,'..','utils','logger.js'));

var propertiesFileName = (process.env.NODE_ENV || 'development') + '.json';
logger.debug('Used properties file: ' + propertiesFileName);

nconf.env().argv();
nconf.add('properties', {type: 'file', file: path.join(__dirname, propertiesFileName)});
nconf.load();

module.exports = nconf;