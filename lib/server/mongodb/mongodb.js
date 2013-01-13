/*
 * Mongodb
 * manages the connection between the db
 * 
 */


/*
 * Module dependencies
 */

var Db          = require('mongodb').Db,
    Connection  = require('mongodb').Connection,
    Server      = require('mongodb').Server
    config      = require('../config');


//var serverConfig = new Server('localhost', 27017, {auto_reconnect:true});

//var db = new Db('listinception', serverConfig, {fsync: true});

var serverConfig = new Server(config.mongodb.host, config.mongodb.port, {auto_reconnect: true});
var db = new Db('listinception', serverConfig, {fsync: true});

/*
 * Connect to the db and throw and error if we can't connect
 */

console.log(config);

db.open(function(err, db) {
  if (err) throw new Error("Cant connect to mongodb.");
  db.authenticate(config.mongodb.user, config.mongodb.pass, {authdb: 'listinception'}, function(err, result) {
    if (err) throw Error(err)
  });
});


module.exports = db;
