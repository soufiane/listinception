var Router      = require('router'),
    Emitter     = require('emitter'),
    $           = require('jquery'),
    Backbone    = require('backbone'),
    List        = require('list'),
    ListView    = require('list-view'),
    SearchView  = require('./search');



/*
 * Build a tree from flat list of model
 * with parent_id
 */

var renderTree = function(model) {
  var childs = model.get('children');

  if (childs.length) {
    childs.forEach(function(c) {
      var child = lists.get(c._id);
      child.view = new ListView({model:child})
      child.view.render().$el.appendTo(model.view.$('>.children'))
      renderTree(child);
    })
  }
}




var EditorView = Backbone.View.extend({
  el: $('#editor'),
  initialize: function() {
    var self    = this;
    this.lists  = this.options.lists;
    this.search = new SearchView();

    // XXX
    // used only for debugging purposes
    // global var
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

    // when getting the lists from a server
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

});

module.exports = EditorView;
