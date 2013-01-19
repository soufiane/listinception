/*
 * Get all the lists for the logged in user
 * route mounted on /api/lists/me
 *
 */

var mongodb   = require('../../mongodb'),
    ObjectID  = require('mongodb').ObjectID,
    List      = require('../../list');


/*
 * Construct a tree from flat lists
 * XXX: moved to client side
 */

var renderTree = function (tree) {

  var roots = {}
  var store = {
    id: {},
    parent: {}
  }

  // construct the store by id
  tree.forEach(function(m) {
    m.children = []
    store.id[m._id] = m
    store.parent[m.parent_id] = m
  })

  tree.forEach(function(m) {
    if (m.parent_id === null) {
      roots[m._id] = m
    }
    else {
      store.id[m.parent_id].children.push(m)
    }
  })

  return tree
};


module.exports = function(req, res, next) {
  var id = req.params.id,
      q  = {};

  // get all the lists the user has the permissions to edit or view
  q['permissions.' + new ObjectID(req.user._id)] = {$exists: true};

  List.find(q).sort({order_date: 1}).toArray(function(err, lists) {
    if (lists) {
      //var r = renderTree(lists);
      res.send(lists);
    } else if (err) {
      res.send(500, {errors: [{message: "Cannot get the documents."}]});
      console.log(err);
    } else {
      res.send(404, {errors: [{message: "list is not found."}]});
    }
  });
};
