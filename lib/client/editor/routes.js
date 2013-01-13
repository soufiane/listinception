var Router        = require('router'),
    Emitter       = require('emitter'),
    EditorView    = require('./editor-view'),
    ViewChanger   = require('./view-changer'),
    $             = require('jquery'),
    UserDropDown  = require('./user-dropdown'),
    Lists         = require('lists'),
    List          = require('list');


/*
 * Fetch all the lists for the current loggedin user
 */

Lists.prototype.model = List;

var lists = new Lists();


/*
 * Add a list to the collection
 */

Emitter.on('collection:lists:add', function(e) {
  var model = e.model;
  // add the model silently
  // so we can trigger the add event ourselfs
  // and pass more options
  lists.add(model, {silent:true});
  if (e.insertAfter) {
    lists.trigger('add', model, {insertAfter: e.insertAfter})
  } else {
    lists.trigger('add', model, {});
  }
  console.log('model added to lists');
});

/*
 * Check if a model has childrens
 */

Emitter.on('collection:lists:has-children', function (e, cb) {
  var model = e.model,
      id    = model.get('_id'),
      cb    = cb || function() {};

  var res = lists.any(function(m) {
    if (m.get('parent_id') === id) return true
  });

  cb.call(cb, res);
});

/*
 * Get a model by id or cid
 */

Emitter.on('collection:lists:get', function (e, cb) {
  var id = e.id || e.cid;

  if (cb) {
    cb.call(cb, lists.get(id))
  }

})


var buildTree = function (tree) {

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
      try {
        store.id[m.parent_id].children.push(m)
      } catch (e) {
        m.parent_id = null
      }
    }
  })

  return tree
};


function fetch() {
  /*
  lists.fetch({
    url: '/api/lists/me',
    error: function(model, xhr, options) {
      console.log(arguments)
    },
    success: function(model, res, options) {
      console.log(arguments)
    },
    //update: true
  })*/

  $.get('/api/lists/me', function (res) {
    // sort later

    // the tree should be build
    // we should sort before building the tree
    var tree = buildTree(res);
    // reset the list
    if (tree.length) {
      lists.reset(tree);
    } else {
      lists.add(new List({title: "Click to edit this list."}));
    }
  })
};

/*
 */

lists.on('remove', function() {
  if (lists.length === 0) {
      lists.add(new List({title: ""}));
  }
})
/*
 * Editor route
 */


Router.route('', 'editor', function(){

  /*
   * User links dropdown)
   */

  new UserDropDown();


  /*
   *
   * Get all the user's lists
   * get lists from /api/lists
   * if lists -> render them
   * else render create lists form
   *
   */
  

  fetch();

  /*
   * Editor View
   */

  var editor = new EditorView({lists:lists});
  new ViewChanger({editor: editor});

});


function fetchPublicLists(id) {
  $.get('/api/lists/' + id + '/tree', function(data) {
    var tree = buildTree(data);
    // reset the list
    lists.reset(tree);
  });
  return lists
} 

/*
 * List public page view
 */

Router.route('l/:id', 'list', function(id) {
    // the tree should be build
    // we should sort before building the tree

    new EditorView({lists:fetchPublicLists(id)});
});


