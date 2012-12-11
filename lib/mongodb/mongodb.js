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
    Server      = require('mongodb').Server;


var serverConfig = new Server('localhost', 27017, {auto_reconnect:true});

var db = new Db('listinception', serverConfig, {fsync: true});

/*
 * Connect to the db and throw and error if we can't connect
 */


db.open(function(err, db) {
  if (err) throw new Error("Cant connect to mongodb.");
});


module.exports = db;
