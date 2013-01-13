var Router    = require('router'),
    Emitter   = require('emitter'),
    $         = require('jquery'),
    Backbone  = require('backbone'),
    List      = require('list'),
    ListView  = require('list-view');


/*
 * TODO
 * 1. Can change tree sort magicly,
 *    serialize sortable, update each model with it's new order
 *    models with order changed will be synced to the server
 *
 *
 * How:
 * ------------------
 *  keep the models only in one global collection, lists
 *  1. render using the childrens, but get them from the lists global shit
 *    > lists.get(c.id)
 *  2. adding a child to a list
 *    > create a view
 *    > render view
 *    > add model to global lists
 *
 */


var renderTree = function(model) {
  var childs = model.get('children');
  // and get
  if (childs.length) {
    childs.forEach(function(c) {
      var child = lists.get(c._id);
      child.view = new ListView({model:child})
      child.view.render().$el.appendTo(model.view.$('>.children'))
      // add a link to the parent model
      // child.parentList = model;
      // render the child model
      renderTree(child);
    })
  }
}


var SearchView = Backbone.View.extend({
  el: $('#search'),
  events: {
    'keyup input': 'search'
  },
  initialize: function() {
    this.input = this.$('input');
    var self = this;
    Emitter.on('search:search', function(term) {
      self.input.val(term);
      self.search()
    })
  },
  search: function() {
    var val = this.input.val();
    console.log(val);

    var pattern = new RegExp(val, "gmi");

    // hide all the nodes
    $('.node').hide()
    lists.filter(function(model) {
      if (pattern.test(model.get('title') + model.get('note'))) {
        model.view.$el.show().parents('li.node').show()
      }
    });

  }

})

var s = new SearchView()

Router.route('search/:q', function(q) {
  alert(q)
});


var EditorView = Backbone.View.extend({
  el: $('#editor'),
  events: {
    "keydown #new-list": "createList"
  },
  initialize: function() {
    var self = this;
    this.lists = this.options.lists;

    // TODO
    // don't make lists a global var
    window.lists = this.lists;

    // render a model automaticly when added to the list

    this.lists.on('add', function(model,options) {
      model.view = new ListView({model:model})
      var parent = lists.get(model.get('parent_id'));
      var insertAfter = options.insertAfter;
      if (insertAfter) {
        model.view.render().$el.insertAfter(insertAfter);
      }
      else if (parent) {
        model.view.render().$el.appendTo(parent.view.$('>.children'))
      } else {
        model.view.render().$el.appendTo(self.$('.root'))
      }

      model.view.focus();
    });

    this.lists.on('reset', function(col) {
      col.each(function(model) {
        if (model.get('parent_id') === null) {
          // model is root
          model.view = new ListView({model:model})
          model.view.render().$el.appendTo(self.$('.root'))

          renderTree(model);
        }
      })

     })

    this.setupEvents();

  },

  setupEvents: function() {
    var self = this;
    Emitter.on('view-changer:change', function(view) {
      var activeView = self.$el.data('view');
      self.$el.removeClass(activeView).addClass(view).data('view', view);
      // change the height of the editor
      self.$('#playground').height($(window).outerHeight()-$('header').outerHeight());
    })
  },
  createList: function(e) {
    // if the user type enter
    // create the list
    var self = this;
    if (e.keyCode === 13) {
      var list = new List({title: this.$('#new-list').val()});
      this.lists.add(list);
      // add the list to the collection
      list.save(list.toJSON(), {
        error: function(model, xhr, options) {
          console.log("Cant save");
          console.log(xhr)
        },
        success: function(model, res, options) {
          console.log(res)
        }
      })
    }
  }
});

module.exports = EditorView;
