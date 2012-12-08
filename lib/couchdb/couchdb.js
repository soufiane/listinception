/*
 * Couchdb
 * manages the connection between the db
 * 
 */

nano = require('nano')('https://listinception.iriscouch.com');

/*
 * Connect to the db and throw and error if we can't connect
 */

listInceptionDb   = nano.db.use('listinception', function(err, body, header) {
  if (err) {
    console.log(err);
    throw new Error("Cant connect to the db.");
  } else {
    console.log(body);
  }
});


module.exports = listInceptionDb;
