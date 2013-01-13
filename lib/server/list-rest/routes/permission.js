/*
 * 
 * Add a permission
 * permission = {id: user_id, username: username, permission: 'edit'}
 * permissions = {
 *   user_id: ['edit', 'create', 'upload'],
 *   //
 *   permission: ['soufell', 'soufiane']
 *   }
 *
 * }
 * permission.edit: 'soufiane'
 * addToSet: user_id: perm
 *
 * this.perms= new Perms([]);
 * p = new P({id: 'soufiane', p: 'edit'});
 *
 */

var mongodb   = require('../../mongodb'),
    ObjectID  = require('mongodb').ObjectID,
    List      = require('../../list'),
    _         = require('underscore'),
    check     = require('validator').check;


var allowedPerms = ['all', 'view', 'edit'];


// create a permission
var create = function (query, update, options, res) {
  // only owner can edit permission
  List.update(query, update, options, function (err, result) {
    if (err) {
      res.send(403, {errors: {message: "cant update the list"}});
    } else if (result === 0) {
      res.send(403, {errors: {message: "cant update, list is not found, or user is not the owner of the list"}});
    } else {
      res.send(201);
    }
  })
}

/*
 * Only the user creator can update the list for now
 * TODO
 * 1. add collaboratos
 * 2. only update if the user is allowed to do so
 * body = {id: 'the user_id', permissions: [list of perms]
 * update all the childs
 * update the list and all its childs with the new permissions
 */

module.exports = function(req, res, next) {
  var id      = req.params.id,
      lid     = new ObjectID(id), // list i,
      uid     = new ObjectID(req.user._id), // logged in user id
      b       = req.body,
      update  = {$addToSet: {}},
      query = {"$or": [{_id: lid}, {ancestors: lid}]},
      errors  = [],
      options = {multi:true}, // update options
      permissions = b.permissions || [];

      //query   = {_id: lid, 'user.id': uid}, // TODO, 1. users who have the permission 'all'

  try {
    if (b.id === "guest") {
      user_id = "guest";
    } else {
      user_id = new ObjectID(b.id);
    }
  } catch (e) {
    errors.push({message: "id is not valid"});
  }

  // validate that id is an object id
  update['$addToSet']['permissions.' + user_id] = {};
  update['$addToSet']['permissions.' + user_id]['$each'] = permissions;
  
  permissions.forEach(function(p) {
    if (allowedPerms.indexOf(p) === -1) {
      errors.push({message: 'permission is not valid'});
    }
  })

  if (errors.length === 0) {
    create(query, update, options, res);
  } else {
    res.send(403, {errors: errors});
  }
};
