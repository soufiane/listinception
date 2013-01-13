/*
 * Get a list and all its childs
 */

var mongodb   = require('../../mongodb'),
    ObjectID  = require('mongodb').ObjectID,
    List      = require('../../list');

/*
 * TODO
 */

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
      // if the list can be viewed by a guest, or by the current logged in user
      var canBeViewed = false;

      if (req.user) {
        if (list.permissions[req.user._id]) canBeViewed = true
      } else if (list.permissions['guest']) {
        canBeViewed = true
      }
      console.log(list.permissions);
      console.log(canBeViewed);
      if (canBeViewed) {
        // get it's ancestors
        List.find({ancestors: list._id}).toArray(function(err, child) {
          if (!err) {
            // add the parent list to the childs
            child.push(list);
            res.send(200, child)
          } else {
            res.send(500, [{message: "cant get the childs"}]);
          }
        })
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
