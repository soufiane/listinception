/*
 * 
 * Authenticate the user
 * 
 *
 */


var bcrypt  = require('bcrypt'),
    User    = require('../../user');


/*
 * Hash a password using bcrypt
 * @param {password} string
 * @param {salt_length) number
 * @param {callbacf} function
 *
 */

var hash = bcrypt.hash;

/*
 * Compare a password
 */

var compare = bcrypt.compare;

/*
 * Add user to the session
 */

function addUser(req, user) {
  req.session.user = {
    _id: user._id,
    username: user.username,
    email: user.email
  }
};


/*
 * Authenticate the user
 */

module.exports = function(req, res, next) {
  var username = req.body.username,
      password = req.body.password;
  
  User.findOne({username: username}, function(err, user) {
    if (user) {
      compare(password, user.password, function(err, result) {
        if (err) {
          res.send(500, {errors: [{message: "An error happened."}]});
          console.log(err);
        } else if (result) {
          addUser(req, user);
          res.send(200);
        } else {
          res.send(403, {errors: [{message: "Password or username don't match"}]});
        }
      });
    } else if (err) {
      res.send(500, {errors: [{message: "An error happened."}]});
      console.log(err);
    } else {
      res.send(404, {errors: [{message: "User not found."}]});
    }
  })


};
