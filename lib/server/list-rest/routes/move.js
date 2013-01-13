/*
 * 
 * Move a list in the tree
 *
 */

var mongodb   = require('../../mongodb'),
    ObjectID  = require('mongodb').ObjectID,
    List      = require('../../list'),
    check     = require('validator').check;



/*
 * Only the user creator can update the list for now
 * TODO
 * 1. add collaboratos
 *   -> how to be able to drag and drop
 *   -> create a new listin the collaborator dir
 *      mark it as cloned, and that list can be moved arround,
 *      when the list is changed, update the original one, not the fork
 *      order_can change in the new one, but not in the original one
 */

// when parent_id changes
// move the list in the tree
// put /api/lists/:id/move
// 1. get the new parent id
// 2. get its ancestors
// 3. add them to the model
// 4. push parent_id to them
// 5. change model.parent_id to the new one
// 6. update the new model
// 
// 7. remove all childs.ancestors
//    update(ancestprs: model._id}, remove: old.ancestors, push: new.ancestors})


var formatError = function(message) {
  return {error: {message: message}}
}

var respond = function (res, errors) {
  if (errors.length) {
    res.send(403, {errors: errors});
  } else {
    res.send()
  }
};


module.exports = function(req, res, next) {
  var id          = req.params.id,
      oid         = new ObjectID(id),
      update      = {$set: {}},
      b           = req.body,
      order_date  = new Date(b.order_date),
      errors      = [];

  // find the parent
  // XXX, parent id can be null
  // in this case just remove all ancestors
  // and update parent_id of childs to null
  if (b.parent_id) {
    try {
      parentId  = new ObjectID(b.parent_id); // parent_id can be null
    } catch (e) {
      errors.push('parent id is not valid');
      respond(res, errors)
      return
    }
    List.findOne({_id: parentId}, function (err, parent) {
      console.log(parent)
      res.send({meow:'cool'});
      if (err) {
        errors.push(formatError('cant get the parent list'));
        respond(res, errors);
      } else if (parent) {
        var parentAncestors = parent.ancestors;
        parentAncestors.push(parent._id)

        // update the moved model ancestors
        List.update({_id: oid}, {$set: {parent_id: parentId, ancestors: parentAncestors, order_date: order_date}}, function(err, result) {
          if (err) {
            errors.push(formatError('cant update the child'))
            respond(res, errors);
          } else if (result === 1) {
            // value has been updated
            // update all childs
            // TODO add moved model._id to parentAncestors
            //parentAncestors.push(oid);
            List.update({ancestors: oid}, {$pullAll: {ancestors: b.ancestors }, $addToSet: { $each: parentAncestors}}, {multi: true}, function(err, updateResult) {
              if (err) {
                // TODO reupdate
                errors.push(formatError('can update children'));
                respond(res, errors);
              } else if (updateResult === 1) {
                console.log('ancestors updated');
                respond(res, errors)
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
