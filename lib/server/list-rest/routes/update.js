/*
 * 
 * Update a list
 *
 */

var mongodb   = require('../../mongodb'),
    ObjectID  = require('mongodb').ObjectID,
    List      = require('../../list'),
    _         = require('underscore'),
    check     = require('validator').check;



var allowedStates = ['open', 'collapsed'];
var allowedStatus = ['new', 'completed'];

/*
 * Only the user creator can update the list for now
 * TODO
 * 1. add collaboratos
 * 2. only update if the user is allowed to do so
 */

module.exports = function(req, res, next) {
  var id      = req.params.id,
      lid     = new ObjectID(id), // list id
      update  = {$set: {}},
      query   = {_id: lid},
      b       = req.body,
      errors  = [];

    

  // update state

  if (b.state && allowedStates.indexOf(b.state) !== -1) {
    update['$set']['state'] = b.state;
  }

  // update title

  if (b.title && b.title.length <= 512) {
    update['$set']['title'] = b.title;
  } else if (b.title && b.title.length > 512){
    errors.push({message: 'title is too long'});
  }

  // update status, completed, inprogress

  if (allowedStatus.indexOf(b.status) !== -1) {
    update['$set']['status'] = b.status;
  }
    
  // update note
  if (b.note && b.note.length > 1024) {
    errors.push({message: 'note cant be more than 1024 chars.'});
  };

  if (typeof b.note !== "undefined") {
    update['$set']['note'] = b.note;
  }

  // update order_date
  if (new Date(b.order_date).toString() !== "Invalid Date") {
    update['$set']['order_date'] = new Date(b.order_date);
  }
    

  // update users permissions
  // TODO
  // 1. validate that permission is either view, or edit
  // 2. validate the object id

  if (b.users && b.users.length) {
    update['$addToSet'] = {'users': {$each: []}};
    b.users.forEach(function(u) {
      if (u.permission === 'edit' || u.permission === 'view') {
        if (u.id === 'guest') {
          update['$addToSet']['users']['$each'].push({id: u.id, username: u.username, permission: u.permission});
        } else {
          update['$addToSet']['users']['$each'].push({id: new ObjectID(u.id), username: u.username, permission: u.permission});
        }
      } else {
        errors.push({message: 'invalid permission'});
      }
    })
  }

  var updateList = function() {
    if (!_.isEmpty(update)) {
    console.log(query);
    List.update(query, update, function (err, result) {
      if (err || result === 0) {
        console.log(err);
        console.log(result);
        res.send(500, {errors: [{message: 'You dont have the permission to update.'}]});
      } else {
        res.send(200);
      }
    });
    } else {
        res.send(500, {errors: [{message: 'update is empty'}]});
     }
  };


  if (req.user && req.user._id === b.user.id) {
    // it's the owner of the list, he can do anything to the list
    var uid = new ObjectID(req.user._id); // logged in user id
    query['user.id']  = uid;
    console.log('user is the owner');
  } else if (req.user) {
    // TODO
    // move all updates to use the permissions array
    // index the permissions array

    var uid = new ObjectID(req.user._id),
        firstOr = {};

    firstOr['permissions.' + uid] = 'edit' // user has the edit permission

    query['$or'] = [];

    query['$or'].push(firstOr); // user has the permission to edit
    query['$or'].push({'permissions.guest': 'edit'}); // list is editable by guests, so any logged in user can edit it

    console.log('user is an editor or a guest');
  } else {
    // user is not logged in, see if a guest can update the list
    query['permissions.guest'] = 'edit';
  }

  for (var key in update) {
    if (_.isEmpty(update[key])) {
      delete update[key];
    }
  }

  console.log(update);
  //console.log(query);
  

  if (errors.length === 0) {
    updateList();
  } else {
    res.send(403, {errors: errors});
  }
};
