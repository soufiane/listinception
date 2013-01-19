/*
 * Get a list and all its childs
 */

var mongodb   = require('../../mongodb'),
    ObjectID  = require('mongodb').ObjectID,
    List      = require('../../list');


module.exports = function(req, res, next) {
  var id      = req.params.id,
      errors  = [];

  try {
    id = new ObjectID(id);
  } catch (e){
    res.send(404, 'list not found');
  }
  
  List.findOne({_id: id}, function(err, list) {
    if (list) {

      // check if the user has permissions to see the list
      // or if the list is viewable by guests

      var canBeViewed = false;
      if (req.user) {
        if (list.permissions[req.user._id]) canBeViewed = true
      } else if (list.permissions['guest']) {
        canBeViewed = true
      }

      if (canBeViewed) {
        res.send(list);
      } else {
        res.send(403, [{message:'you dont have the permission view this list'}]);
      }
    } else if (err) {
      res.send(500, [{message: "cant get the list"}]);
      console.log(err);
    } else {
      res.send(404, [{message: "list is not found"}]);
    }
  });



};
