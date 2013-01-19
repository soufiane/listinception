/*
 * 
 * Move a list in the tree
 *
 */

var mongodb   = require('../../mongodb'),
    ObjectID  = require('mongodb').ObjectID,
    List      = require('../../list'),
    check     = require('validator').check;




var formatError = function(message) {
  return {message: message}
}

/*
 * Respond to the request
 */

var respond = function (res, errors) {
  if (errors.length) {
    res.send(403, {errors: errors});
  } else {
    res.send(201);
  }
};


module.exports = function(req, res, next) {
  var id          = req.params.id,
      oid         = new ObjectID(id),
      update      = {$set: {}},
      b           = req.body,
      order_date  = new Date(b.order_date),
      errors      = [];

  if (b.parent_id) {
    try {
      parentId  = new ObjectID(b.parent_id);
    } catch (e) {
      errors.push('parent id is not valid');
      respond(res, errors)
      return
    }
    // find the the parent list
    List.findOne({_id: parentId}, function (err, parent) {
      if (err) {
        errors.push(formatError('cant get the parent list'));
        respond(res, errors);
      } else if (parent) {
        // replace the the list we are moving ancestors' with it's new parent's ancestors
        var parentAncestors = parent.ancestors;
        parentAncestors.push(parent._id);

        // update the moved model ancestors from the new parent ancestors
        List.update({_id: oid}, {$set: {parent_id: parentId, ancestors: parentAncestors, order_date: order_date}}, function(err, result) {
          if (err) {
            errors.push(formatError('cant update the child'))
            respond(res, errors);
          } else if (result === 1) {
            // remove all old ancestors from childs
            List.update({ancestors: oid}, {$pullAll: {ancestors: b.ancestors }}, {multi: true}, function(err, updateResult) {
              if (err) {
                console.log(err);
                errors.push(formatError('can update children'));
                respond(res, errors);
              } else if (updateResult === 1) {
                // add new ancestors to childs
                List.update({ancestors: oid}, { $addToSet: { ancestors: {$each: parentAncestors}}}, {multi: true}, function(err, updateResult) {
                  if (err) {
                    console.log(err);
                    errors.push(formatError('can update children'));
                    respond(res, errors);
                  } else {
                    respond(res, errors);
                  }
                });
              }
            });
          };
        });

      } else {
        errors.push(formatError('Parent not found!'));
        respond(res, errors);
      }
    });
  } else {
    // set it's parent id to null
    // remove it's ancestors == []
    // remove it's ancestors from childs

    List.update({_id: oid}, {$set: {parent_id: null, ancestors: [], order_date: order_date}}, function(err, result) {
      if (err) {
        errors.push(formatError('can update with parnet_id'));
        respond(res, errors);
      } else if (result === 1) {
        List.update({ancestors: oid}, {$pullAll: {ancestors: b.ancestors}}, {multi: true}, function(err, result) {
          if (err) {
            errors.push(formatError('can update childs'));
            respond(res, errors);
            console.log(err);
          } else if (result === 1) {
            respond(res, errors);
          }
        })
      }
    })
  }
};
