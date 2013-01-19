/*
 * 
 * Get all the users that have permission to [edit, view] this list
 *
 */

var mongodb   = require('../../mongodb'),
    ObjectID  = require('mongodb').ObjectID,
    List      = require('../../list'),
    User      = require('../../user'),
    check     = require('validator').check;



var allowedStates = ['open', 'collapsed'];

/*
 * return all the ids from the permissions object
 */

function getIds(permissions) {
  var ids = [];
  for (var k in permissions) {
    if (k !== 'guest') {
      ids.push(new ObjectID(k));
    }
  }
  return ids
}

/*
 * merge each user with it's permissions
 * also add the guest user
 * return users
 */

function merge(users, permissions) {
  users.forEach(function(u) {
    var perms = permissions[u._id] || [];
    u.permissions = perms
  })
  if (permissions['guest']) {
    users.push({
      _id: 'guest',
      username: 'guest',
      permissions: permissions['guest'],
      email: 'guest'
    });
  }
  return users
}

/*
 * Only the user creator can update the list for now
 * TODO
 * 1. add collaboratos
 */

module.exports = function(req, res, next) {
  var id      = req.params.id,
      lid     = new ObjectID(id);

  // get the parent list
  List.findOne({_id: lid}, {permissions: 1}, function(err, list) {
    // if permissions is empty
    // return an empty list
    if (list) {
      // get only username, id, email
      User.find({_id: {$in: getIds(list.permissions) }}, {email:1, username:1, _id:1}).toArray(function(err, users) {
        if (users && users.length) {
          // merge each one with its permissions, do it client side
          res.send(merge(users, list.permissions));
        } else if (err) {
          res.send(500, {errors: [{message: 'cant update.'}]});
        } else {
          res.send(404, {errors: [{message: 'cant find collaboratos.'}]});
        }
      })
    } else if (err) {
      res.send(500, {errors: [{message: 'cant update.'}]});
    } else {
      res.send(404, {errors: [{message: 'cant get parent list.'}]});
    }
  })


};
