/*
 * List model
 * used to create, find, update, delete, ...
 *
 */

mongodb  = require('../mongodb');


/*
 * Index a field and throw an error if it fails
 */

function ensureIndex(collection, index, options) {
  collection.ensureIndex(index, options, function(err) {
    if (err) throw err;
  });
};

/*
 * Lists collection
 */

var List;

mongodb.collection('lists', function(err, collection) {
  if (err) throw err;
  List = collection;

  setTimeout(function() {
  
    // index the permissions
    // because we are requesting using them
    ensureIndex(List, {'permissions.id': 1})

  });

});



/*
 * Export the List constructor
 */

module.exports = List
