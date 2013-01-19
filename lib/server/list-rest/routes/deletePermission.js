/*
 * 
 * Delete a permission
 *
 */

var mongodb   = require('../../mongodb'),
    ObjectID  = require('mongodb').ObjectID,
    List      = require('../../list'),
    _         = require('underscore'),
    check     = require('validator').check;


var allowedPerms = ['all', 'view', 'edit'];


var del = function (query, update, options, res) {
  // only owner can edit permission
  List.update(query, update, options, function (err, result) {
    if (err) {
      console.log(err)
      res.send(403, {errors: {message: "cant update the list"}});
    } else if (result === 0) {
      res.send(403, {errors: {message: "cant update, list is not found, or user is not the owner of the list"}});
    } else {
      res.send(200);
    }
  })
}

/*
 * It changes the permission of the list and all
 * it childs
 * only the owner of the list can remove permission from others
 */

module.exports = function(req, res, next) {
  var id      = req.params.id, // list id
      user_id = req.params.user_id, // the user we are removing permissions for
      lid     = new ObjectID(id), // list id
      uid     = new ObjectID(req.user._id), // logged in user id
      b       = req.body,
      query   = {$or: [{_id: lid}, {ancestors: lid}]},
      update  = {$unset: {}},
      errors  = [],
      options = {multi:true}; // mongodb update options


  update['$unset']['permissions.' + b.id] = 1;

  if (errors.length === 0) {
    del(query, update, options, res);
  } else {
    res.send(403, {errors: errors});
  }
};
