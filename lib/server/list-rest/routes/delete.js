/*
 * 
 * Update a list
 *
 */

var mongodb   = require('../../mongodb'),
    ObjectID  = require('mongodb').ObjectID,
    List      = require('../../list'),
    check     = require('validator').check;



function remove(query, res) {
  List.remove(query, function (err, result) {
    if (err) {
      res.send(500, {errors: [{message: 'Cant remove the list.'}]});
    } else if (result === 0) {
      res.send(403, {errors: [{message: 'You dont have the permission to update'}]});
    } else {
      res.send(200);
    }
  });
}


/*
 * Only the user creator can update the list for now
 * TODO
 * 1. collaborators with the edit decision can also delete the list
 * 2. delete all ancestors with the model
 */

module.exports = function(req, res, next) {
  var id      = req.params.id,
      oid     = new ObjectID(id),
      b       = req.body,
      query   = {$or: [
        {_id: oid},
        {ancestors: oid}
        ]};

  if (req.user) {
    // user may be a collaborator, or the owner of the list so add it to the query
    var uid = new ObjectID(req.user._id),
        firstOr = {};

    firstOr['permissions.' + uid] = 'edit' // user has the edit permission

    //query['$or'] = [];

    query['$or'].push(firstOr); // user has the permission to edit
    query['$or'].push({'permissions.guest': 'edit'}); // list is editable by guests, so any logged in user can edit it
 
  } else {
    // user is not logged in, see if the list can be deleted by a guest
    query['permissions.guest'] = 'edit';
  }
  
  console.log(query)
  // remove the list
  remove(query, res);

};
