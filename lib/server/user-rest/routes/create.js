/*
 * 
 * Create a list route
 * validate and add defaults to the list before storing it to the db
 *
 */

var mongodb = require('../../mongodb');
    check   = require('validator').check;
    bcrypt  = require('bcrypt'),
    User    = require('../../user');


/*
 * Keys
 * only those attributes should be present in the final list
 */

var KEYS = [
  '_id',
  'created_at',
  'username',
  'email',
  'password'
];


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
 * Validate the user
 * @param {json} object
 * @return json
 */


var validate = function(json) {
  if (!json) throw new Error("Json is not valid");

  try {
    // validate the username
    check(json.username, "Username should be between 2 and 20 chars.").len(2, 20);
    // user.email must be a valid email
    check(json.email, "Email is not valid.").isEmail();
    // validate password
    check(json.password, "Password must be between 6 and 50 chars.").len(6,50);
  } catch (e) {
    throw e
  }
  return json
};

/*
 * Add defaults attributes before saving
 */

var defaults = function(json) {
  json.created_at = new Date;
  return json
};

/*
 * Removes unwanted attributes
 */

var stripe = function(json) {
  for (key in json) {
    if (KEYS.indexOf(key) === -1) {
      delete json[key];
    }
  }
  return json
};

/*
 * Proccess json
 * run all the above function the data (validate, stripe, defaults)
 */

var ProcessJson = function (processors) {
  this.processors = processors;
  return this
}

ProcessJson.prototype.reducer = function (existing, processor) {
  if (processor) {
    return processor(existing || {});
  } else {
    return prev;
  };
};

/*
 * Process the json
 * use the array.reduce function to run (validate, stripe, defaults)
 */

ProcessJson.prototype.process = function(json) {
  return this.processors.reduce(this.reducer, json);
};

/*
 * Insert the user into the db
 * and respond to the client
 * @param {object} json
 * @param {object} res
 */

var insertUser = function(json, res) {
  User.insert(json, function(err, user) {
    // check if there is a conflict ex: user with the same username already exists
    if (user) {
      res.send({id: user[0]._id});
      // TODO
      // 1. authenticate the user
    } else if (err && err.message.indexOf('E11000') !== -1) {
      res.send(400, {errors: [{message: "User already exists"}]});
    } else {
      res.send(500, {errors: [{message: "Cannot store the document"}]});
      console.log(err);
    }
  });
};

/*
 * Create a user
 */

module.exports = function(req, res, next) {
  var processor = new ProcessJson([validate, stripe, defaults]);
  try {
    var validData = processor.process(req.body);
    // Hash the password
    hash(validData.password, 10, function(err, hashed_pass) {
      // Replace the plaintext password with the hashed one
      if (!err) {
        validData.password = hashed_pass;
        insertUser(validData, res);
      } else {
        res.send(500, {errors: [
          {message: "Cannot save the user"}
          ]});
        console.log(err);
      }
    });

  } catch (e) {
    res.send(403, {errors: [{message: e.message}]});
  }
};
