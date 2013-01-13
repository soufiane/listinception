/*
 * 
 * Get a user public attributes
 * username, id
 *
 */

var mongodb   = require('../../mongodb');
    check     = require('validator').check;
    bcrypt    = require('bcrypt'),
    User      = require('../../user'),
    ObjectID  = require('mongodb').ObjectID;



/*
 * Get a user
 */

module.exports = function(req, res, next) {
  var query = {},
      id    = req.params.id;

  // if id == guest just return
  if (id === 'guest') {
    res.send({_id: 'guest', username:'guest'});
    return 
  }

  // TODO
  // 1. put this in a try/catch
  if (id.length === 24) {
    id = new ObjectID(id);
    query['_id'] = id;
  } else {
    query['username'] = id;
  }

  // get only public attributes
  User.findOne(query, {_id:1, username: 1}, function(err, user) {
    console.log(user);
    if (user) {
      res.send(user);
    } else if (err) {
      res.send(500, {errors: ['cant get the user']});
    } else {
      res.send(404, {errors: ['user is not found']});
    }
  });

};
