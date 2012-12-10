/*
 * 
 * Create a list route
 * validate and add defaults to the list before storing it to the db
 *
 */

couchdb = require('../../couchdb');
check   = require('validator').check;
bcrypt  = require('bcrypt');

/*
 * Keys
 * only those attributes should be present in the final list
 */

KEYS = [
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

hash = bcrypt.hash;

/*
 * Compare a password
 */

compare = bcrypt.compare;

/*
 * Validate the user
 * @param {json} object
 * @return json
 */


validate = function(json) {
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

defaults = function(json) {
  json.created_at = new Date;
  json.type       = 'user';
  // delete the username property and replace it by _id
  // so doc._id is the username
  json._id        = json.username;
  delete json.username;
  return json
};

/*
 * Removes unwanted attributes
 */

stripe = function(json) {
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

ProcessJson = function (processors) {
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

insertUser = function(json, res) {
  couchdb.insert(json, function(err, body, header) {
    // check if there is a conflict ex: user with the same username already exists
    if (err && err.status_code === 409) {
      res.send(400, {errors: [{message: "User already exists"}]});
    } else if (err) {
      res.send(500, {errors: [{message: "Cannot store the document"}]});
    } else {
      res.send({id: body.id});
    }
  });
 
};


/*
 * Create a user
 * BUG:
 *  1. Couchdb doesn't support unique keys
 *  2. There is only nasty solution to support it 
 */

module.exports = function(req, res, next) {
  var processor = new ProcessJson([validate, stripe, defaults]);
  try {
    var validData = processor.process(req.body);
    // Hash the password
    hash(validData.password, 10, function(err, hashed_pass) {
      // Replace the plaintext password with the hashed one
      if (!err) {
        console.log(hashed_pass);
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
