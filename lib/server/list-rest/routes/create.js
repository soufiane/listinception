/*
 * 
 * Create a list route
 * validate and add defaults to the list before storing it to the db
 * TODO
 * 1. don't the store the user as an object, just store the user_id: ObjectID
 *
 */

var mongodb   = require('../../mongodb'),
    ObjectID  = require('mongodb').ObjectID,
    List      = require('../../list'),
    _         = require('underscore'),
    check     = require('validator').check;
    


/*
 * Keys
 * only those attributes should be present in the final list
 *
 * Permissions:
 * permissions: [
 *   // not so good
 *   {user_id: req.user.id, permissions: ["*"]}, // the owner of the list, he can do anything
 *   {user_id: user_id: permissions: ['*']},
 *   {user_id: guest: permissions: ['view']},
 *   {user_id: user_id: permissions: ['view', 'edit', 'delete']}
 *   // good for updates
 *   { edit: ['soufell', 'soufiane'], 
 *     all: ['owner', 'guests']
 * ]
 */

var KEYS = [
  'title',
  'created_at',
  'note',
  'user',
  'parent_id',
  'order_date', // TODO validate that's a date
  'ancestors',
  'state', // open, collapsed
  'status', // completed, new
  'permissions',
  '_id',
];


/*
 * Validate the list
 * @param {json} object
 * @return json
 */

var validate = function(json) {
  if (!json) throw new Error("Json is not valid");

  try {
    // list title should be between 1 and 512 chars
    check(json.title, "Title should be between 1 and 512 characters.").len(0, 512);
    // list description should be between 1 and 1024 chars
    check(json.note).len(0, 1024);
    // validate permissions
  } catch (e) {
    throw e
  }
  return json
};

/*
 * Add defaults attributes before saving
 */

var defaults = function(json) {
  json.title        = json.title || "";
  json.created_at   = new Date;
  json.parent_id    = json.parent_id || null;
  json.ancestors    = json.ancestors || [];
  //json.permissions  = json.permissions || [{id: new ObjectID(this.req.user._id), permissions: ['all']}]
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

var ProcessJson = function (processors, req) {
  this.req = req;
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
 * Insert the list into the db
 * and respond to the client
 * @param {object} json
 * @param {object} res
 */

var insertList = function(json, res) {
  List.insert(json, function (err, docs) {
    if (err) {
      res.send(500, {errors: [{message: "Cannot store the document"}]});
    } else {
      var list = docs[0];
      res.send({
        id: list._id,
        _id: list._id,
        user: list.user,
        ancestors: list.ancestors,
        created_at: list.created_at,
        permissions: list.permissions
      });
    }
  });
};

/*
 * Merge child permissions with parent permissions
 */

function merge(child, parent) {
  for (var k in parent) {
    if (!child[k]) {
      child[k] = parent[k];
    } else {
      child[k] = _.unique(parent[k].concat(child[k]));
    }
      
  }
}

/*
 * Create list route
 * validate the date
 * insert on the db
 * respond with json
 * if json.parents
 *   get the parents
 *   merge there ancestors
 *   insert the list
 *
 * an anonymous user can create lists
 */

module.exports = function(req, res, next) {
  // pass req to processor to get the session from it
  var processor = new ProcessJson([validate, stripe, defaults], req),
      validData = processor.process(req.body);

  if (req.user) {
    var userId    = req.user._id,
        uid       = new ObjectID(userId);
    validData.user = {id: uid, username: req.user.username};
  } else {
    var userId = uid = 'guest';
    validData.user = {id: uid, username: 'guest'};
  }
 
  if (req.user || validData.parent_id) {
    validData.permissions   = {};
    validData.permissions[uid.toString()] = ['all'];

    // if user 
    //   just create
    // else if (parent, create
    // else
    //  not authorised
    //  guest users cant create root lists; eg a list without a parent

    if (validData.parent_id) {
      List.findOne({_id: new ObjectID(validData.parent_id)}, function(err, listParent) {
         if (!err && !listParent) {
            res.send(404, {errors: [{message: "Parent not found."}]});
          } else if (err) {
            res.send(500, {errors: [{message: "Cannot get the parent document."}]});
            console.log(err);
          } else {
            // store the list
            // add ancestors to it
            validData.ancestors = listParent.ancestors;
            validData.ancestors.push(listParent._id);
            validData.parent_id = listParent._id;
            
            // merge the permissions of the parent with the child
            merge(validData.permissions, listParent.permissions);
     
            console.log(validData.permissions);

            // add the current user to it
            insertList(validData, res);
        };
      });
    } else {
      insertList(validData, res);
    }

  } else {
    res.send(403, [{message: 'you cant create root lists, you must log in'}]);
  }

};
