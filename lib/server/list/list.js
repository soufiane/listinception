/*
 * List model
 * used to create, find, update, delete, ...
 * 
 * TODO
 * 1. refactor it to use a simple model system instead of exposing just functions
 *
 */

mongodb  = require('../mongodb');

/*
 * Lists collection
 */

var List;

mongodb.collection('lists', function(err, collection) {
  if (err) throw err;
  List = collection;
});



/*
 * Export the List constructor
 */

module.exports = List
