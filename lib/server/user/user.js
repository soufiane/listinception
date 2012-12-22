/*
 * User model
 * 
 */

var mongodb  = require('../mongodb');

/*
 * Index a field and throw an error if it fails
 */

function ensureIndex(collection, index, options) {
  collection.ensureIndex(index, options, function(err) {
    if (err) throw err;
  });
};

/*
 * User collection
 */

var User;

mongodb.collection('users', function(err, collection) {
  if (err) throw err;
  User = collection;
  
  /*
   * Create indexes when the db is connected
   */

  setTimeout(function() {
  
    /*
     * Ensure that username is unique
     */

    ensureIndex(User, {username:1}, {unique: true});

    /*
     * Ensure that email is unique
     */

    ensureIndex(User, {email:1}, {unique: true});

  }, 1000);
});



/*
 * Export the List constructor
 */

module.exports = User;
