/*
 * Get a list
 */

var mongodb   = require('../../mongodb'),
    ObjectID  = require('mongodb').ObjectID,
    List      = require('../../list');


module.exports = function(req, res, next) {
  id = req.params.id;
  
  List.findOne({_id: new ObjectID(id)}, function(err, list) {
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
