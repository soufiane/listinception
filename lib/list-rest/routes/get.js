/*
 * Get a list
 */

var mongodb = require('../../mongodb'),
    ObjectID  = require('mongodb').ObjectID;

/*
 * Mongodb Lists collection
 */

var Lists;

mongodb.collection('lists', function(err, collection) {
  if (err) throw err;
  Lists = collection;
});


module.exports = function(req, res, next) {
  id = req.params.id;
  
  Lists.findOne({_id: new ObjectID(id)}, function(err, list) {
    if (list) {
      res.send(list);
    } else if (err) {
      res.send(500, {errors: [{message: "Cannot get the document."}]});
      console.log(err);
    } else {
      res.send(404, {errors: [{message: "list is not found."}]});
    }
  });
};
