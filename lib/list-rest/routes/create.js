/*
 * 
 * Create a list route
 * validate and add defaults to the list before storing it to the db
 *
 */

var mongodb   = require('../../mongodb'),
    ObjectID  = require('mongodb').ObjectID,
    check     = require('validator').check;

/*
 * Keys
 * only those attributes should be present in the final list
 */
KEYS = [
  'title',
  'created_at',
  'description',
  'user_id',
  'parent_id',
  'ancestors',
  '_id',
  '_rev'
];

/*
 * Mongodb Lists collection
 */

var Lists;

mongodb.collection('lists', function(err, collection) {
  if (err) throw err;
  Lists = collection;
});


/*
 * Validate the list
 * @param {json} object
 * @return json
 */

validate = function(json) {
  if (!json) throw new Error("Json is not valid");

  try {
    // list title should be between 1 and 512 chars
    check(json.title, "Title should be between 1 and 512 characters.").len(1, 512);
    // list description should be between 1 and 1024 chars
    check(json.description).len(0, 1024);
    // make sure that parents is an array if present
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
  json.parent_id  = json.parent_id || null;
  json.ancestors  = json.ancestors || [];
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
 * Insert the list into the db
 * and respond to the client
 * @param {object} json
 * @param {object} res
 */

insertList = function(json, res) {
  Lists.insert(json, function (err, list) {
    if (err) {
      res.send(500, {errors: [{message: "Cannot store the document"}]});
    } else {
      res.send({id: list[0]._id});
    }
  });
};


/*
 * Create list route
 * validate the date
 * insert on the db
 * respond with json
 * if json.parents
 *   get the parents
 *   merge there ancestors
 *   insert the list
 */

module.exports = function(req, res, next) {
  var processor = new ProcessJson([validate, stripe, defaults]);
  try {
    var validData = processor.process(req.body);
    // insert the data in the db
    // if model has parents get the parents by id
    // merge the ancestors
  
    if (validData.parent_id) {
      Lists.findOne({_id: new ObjectID(validData.parent_id)}, function(err, listParent) {
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
            insertList(validData, res);
        };
      });
    } else {
      insertList(validData, res);
    }

  } catch (e) {
    res.send(403, {errors: [{message: e.message}]});
  }
};
