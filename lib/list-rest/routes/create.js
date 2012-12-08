/*
 * 
 * Create a list route
 * validate and add defaults to the list before storing it to the db
 *
 */

couchdb = require('../../couchdb');
check   = require('validator').check;

/*
 * Keys
 * only those attributes should be present in the final list
 */
KEYS = [
  'title',
  'created_at',
  'description',
  'user',
  '_id',
  '_rev'
];


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
 * Create list route
 * validate the date
 * insert on the db
 * respond with json
 */

module.exports = function(req, res, next) {
  processor = new ProcessJson([validate, stripe, defaults]);
  try {
    validData = processor.process(req.body);
    // insert the data in the db
    couchdb.insert(validData, function(err, body, header) {
      if (err) {
        res.send(501, {errors: [{message: "Cannot store the document"}]});
      } else {
        res.send({id: body.id, rev: body.rev});
      }
    });
  } catch (e) {
    res.send(403, {errors: [{message: e.message}]});
  }
};
