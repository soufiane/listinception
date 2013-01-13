var Backbone  = require('backbone'),
    Emitter   = require('emitter'),
    List      = require('list'),
    template  = require('./template'),
    _         = require('underscore'),
    $         = require('jquery'),
    jqueryUi  = require('jquery-ui'),
    moment    = require('moment');



/*
 * lists privacy
 * public list:
 * privacy: public | private | restricted
 * permissions: {
 *   collaboratos: ['edit', 'view'],
 *   guests: ['view', 'edit']
 * },
 * guests: ['soufiane', 'soufell'],
 * collaboratos: ['soufell', 'another_user']
 * -----------------------------------------
 *
 * permitions: [
 *   { user_id: permitions: ['edit', 'view', 'delete' }
 * ]
 *
 * collaborators: [
 *   { user_id: id, permissions: ['edit', 'view', 'delete']
 *   'user_id',
 *   'user_id',
 * ],
 *
 * Lorem ipsum
 * group: collaboratores: edit, view
 * group: guests: view
 * group: owner: delete
 * collaboratos: can do everything, from deleting, to editing to adding new things
 * groups: {
 *  collaboratos: [{meow: can }]
 * }
 * // get all the lists for the user
 * // and get all the shared lists with the user
 * List.find({'collaborators.user_id': new ObjectID(req.user.id)}) // get all the lists
 *
 *
 * Share a list:
 * ------------
 * 1. Get the link, and share it with others
 *    add permitions * : view, edit
 * 2. Type the email of a workflowy user to share it with them
 *   add permitions user_id: ['view', 'edit']
 *
 * when updating a list, check first for the permissions
 *
 */



/*
 * Show a tooltip on hover with buttons
 * Add note | complete | share | ...
 *
 */

var ActionTooltipView = Backbone.View.extend({

  events: {
    'click .add-note': 'note',
    'click .complete': 'complete',
    'click .mark-new': 'markNew',
    'click .share'   : 'share',
    'click .delete'  : 'del'
  },

  initialize: function() {
    this.parentView   = this.options.parentView;
    this.parentModel  = this.parentView.model;
    var p             = this.parentView;
    var that          = this;

    // remove this view
    p.on('destroy', _.bind(this.destroy, this));
    // get the view element when the parent view has been rendered
    
    p.on('render', function() {
      that.setElement(p.$('>.action-tooltip'));
      // buttons
      that.buttons = {
        addNote: that.$('.add-note'),
        markNew: that.$('.mark-new'),
        complete: that.$('.complete'),
        share: that.$('.share'),
        del: that.$('.delete')
      }

    });

  },

  note: function (e) {
    // show the note text area
    // get note value and add it there
    // hide the note

    //Emitter.trigger('view:list-view:add-note', {model: this.model});
    this.parentView.editNote(e);
  },

  complete: function (e) {
    console.log('completing');
    // TODO change this
    this.parentModel.set('status', 'completed');
    this.buttons.complete.removeClass('complete').addClass('mark-new').text('mark new');
  },

  markNew: function () {
    console.log('marking new');
    // TODO change this
    this.parentModel.set('status', 'new');
    this.buttons.complete.removeClass('mark-new').addClass('complete').text('complete');
  },

  share: function (e) {
    console.log('share');
  },

  del: function (e) {
    // TODO change this
    /*
    if (this.parentModel.children.length > 0) {
      alert('Implement deletion of list whit childs')
    } else {
      this.parentView.deleteModel();
    }*/

    var that = this;
    Emitter.trigger('collection:lists:has-children', {model: this.parentModel}, function(res) {
      if (res) {
        alert('Implement deleting list whith children');
      } else {
        that.parentView.deleteModel();
      }
    });
  },

  destroy: function() {
    this.trigger('destroy');
    this.undelegateEvents();
    this.unbind();
    this.$el.removeData().unbind();
    this.remove();
    console.log('action view destroyed.');
  },

});



var dragHelper = $('<div style="cursor:move", class="drag-helper"> move </div>').appendTo(document.body);

// remove this
setTimeout(function() {
  var sortable = $('.root').sortable({
    handle: '>.circle',
    items: '.node',
    placeholder: "drop-placeholder",
    tolerance: 'intersect',
    toleranceElement: '> .title',
    helper: function() {
      return dragHelper
    }
  });
  
  sortable.on('sortupdate', function(e, ui) {
    $(ui.item).trigger('sortupdate');
  })

  sortable.on('sortstart', function (e, ui) {
    //$(ui.item).trigger('sortstart');
  });
  
  sortable.on('sortover', function(e, ui) {
    //console.log(sortable.serialize())
    //e.stopImmediatePropagation();
    console.log('fuc')
  });

  sortable.on('sortout', function(e, ui) {
    //console.log(sortable.serialize())
    //e.stopImmediatePropagation();
    console.log('out')
  });


  console.log('sortable now');

}, 1000);

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

var ListView = Backbone.View.extend({

  tagName: 'li',
  className: 'node',
  template: template,

  events: {
    'click .title': 'edit',
    'keydown .edit-input': 'create',
    'blur input': 'blur',
    'click .collapse': 'collapse',
    'click .show': 'show',
    'click .note': 'editNote',
    'blur .edit-note': 'blurNote',
    'sortupdate': 'test'
  },

  test: function (e) {
    e.stopImmediatePropagation();
    // how to get the new parent_id
    var parentLi  = this.$el.parents(".node:first"),
        cid       = parentLi.data('cid') || null,
        that      = this;


    // how to sort
    // 1. get the model just before this one
    // 2. get the model just after this one
    // 3. generate a random date between the two
    // 4. save the date.

    var index         = lists.indexOf(this.model),
        prevNodeEl    = this.$el.prev('li.node'),
        nextNodeEl    = this.$el.next('li.node'),
        prevNode      = lists.get(prevNodeEl.data('cid')), // change this to use events
        nextNode      = lists.get(nextNodeEl.data('cid')),
        order_date    = null;



    if (prevNode && nextNode) {
      var prevNodeDate  = new Date(prevNode.get('order_date'));
      var nextNodeDate  = new Date(nextNode.get('order_date'));
      //order_date = randomDate(prevNodeDate, nextNodeDate);
    } else if (!prevNode && nextNode) {
      console.log('it has no prev node');
      var nextNodeDate  = new Date(nextNode.get('order_date'));
      var prevNodeDate = new Date(nextNodeDate.getTime());
      moment(prevNodeDate).subtract('ms', 5);
    } else if (!nextNode && prevNode){
      console.log('it has no next node');
      var prevNodeDate  = new Date(prevNode.get('order_date'));
      var nextNodeDate = new Date(prevNodeDate.getTime());
      moment(nextNodeDate).add('ms', 5);
    } else {
      alert('fuuuuuuuuuuuuuuuuuuuuuuuuuck')
    }


    order_date = randomDate(prevNodeDate, nextNodeDate);
    console.log(prevNodeDate.getTime())
    console.log(order_date.getTime())
    console.log(nextNodeDate.getTime())
    /*
    // if no prev
    //   if node.parent_id == null
    //     get the next order_date value
    //     be more miner than it
    //     
    // else if no next
    //   get the prev value and be more than it by 1 milisecond

    // change order
    if (prevNodeEl) {
      //console.log(prevNode)
      console.log('prev ' + prevNodeEl.find('>.title').text());
    }

    if (nextNodeEl) {
      //console.log(nextNode)
      console.log('next ' + nextNodeEl.find('>.title').text());
    }


    if ( prevNodeDate.getTime() < nextNodeDate.getTime()  ) {
      alert('newt')
    }

    var r = randomDate(prevNodeDate, nextNodeDate)

    if (r > nextNodeDate) {
      alert('cool')
    }

    return "mepw"
    //this.model.set('order_date', randomDate(prevNodeDate, nextNodeDate));
    */

    // change parent_id
    if (cid) {
      Emitter.trigger('collection:lists:get', {cid: cid}, function (model) {
        // change the parent it to the new one
        that.model.set({parent_id: model.get('_id'), order_date: order_date});
        //that.model.set({parent_id: model.get('_id'), order_date: randomDate(nextNodeDate, prevNodeDate)});
      });
    } else {
        that.model.set({parent_id: null, order_date: order_date});
        //that.model.set({parent_id: null, order_date: randomDate(nextNodeDate, prevNodeDate)});
    }


  },

  initialize: function() {

    var that = this;
    // holds child views
    // child views should subscribe to this view ondestroy event and clear themselves
    this.views = {};
    // create a new action-tooltip view
    this.views.actionsView = new ActionTooltipView({model: this.model, parentView: this});


    // on delete, complete, marknew, add-note, do the respective shit on this node

    Emitter.on('view:list-view:add-note', function(e) {
      var model = e.model;
      if (model === that.model) {
        alert('this is the view');
      }
    });

    this.model.on('change:parent_id', function (model, parent_id) {
    
      console.log('changing order');
      model.save({parent_id: parent_id, ancestors: model.get('ancestors')},
        {
          url: '/api/lists/' + model.get('_id') + '/move',
          type: 'PUT',
        })

    });


    this.model.on('change:order_date', function(model, order_date) {
      console.log('order_date changed');
      model.save({order_date:order_date, user: model.get('user')}, {patch: true});
    });

    /*
     * Errors are handled on global jquery.ajax
     */

    //  save changes to state

    var that = this;

    // TODO 
    // 1. Change all those methods to use PATCH
    this.model.on('change:state', function(model, state) {
      model.save({state: state}, {wait: true});
      console.log("saving, state")
    });


    // save changes to the note
    this.model.on('change:note', function(model, note) {
      that.$('>.note').html(model.get('md').note);
      // save the model
      model.save({note: note});
      console.log("saving, note");
    });

    //  save changes to title
    this.model.on('change:title', function(model, title) {
      //that.$('>.title').text(title);
      that.$('>.title').html(model.get('md').title);

        // save the model
      model.save({title: title}, {wait: true});
      console.log("saving, title");

    });

    // save changes to status and render the view
    this.model.on('change:status', function(model, status) {
      // add a class to the li
      if (status === 'completed') {
        that.$el.addClass(status).removeClass('new');
        // save the model
        console.log('completing status');
      } else {
        that.$el.addClass(status).removeClass('completed');
        // save the model
        console.log('markking new status');
      }
      model.save({status: status});
    });

    // remove this view on destroy

    this.model.on('destroy', _.bind(this.onDestroy, this));

    // add status classes
    this.$el.addClass(this.model.get('status'))

    // a hack to display the tooltip

    this.$el.on('mouseenter', function(e) {
      e.stopImmediatePropagation()
      //that.$el.children().filter('li').find('>.toggle').css('visibility', 'hidden')

      $('.node').removeClass('hover');

      that.$el.addClass('hover');

      /*
      if (that.model.children.length) {
        var m = that.$('.toggle-' + that.model.get('_id')).css('visibility', 'visible')
      }
      */
      return false
    });

    this.$el.on('mouseleave', function(e) {
      e.stopImmediatePropagation()
      $('.node').removeClass('hover');
      //var m = that.$('.toggle-' + that.model.get('_id')).css('visibility', 'hidden')
      return false
    });

  },

  onDestroy: function() {
    // remove this view
    // and unbind all events
    this.destroy();
  },

  destroy: function() {
    this.trigger('destroy');
    this.undelegateEvents();
    this.unbind();
    this.$el.removeData().unbind();
    this.remove();
  },

  create: function(e) {

    e.stopImmediatePropagation();
    // if list is open
    //   1. save changes to the title
    //   2. add a child to this model
    //   3. show children
    // else if list is collapsed
    //   create a new list on the parent

    var titleInput = this.$('>.edit-input');
    var create = function(model) {
      var list = new List({
        parent_id: model.get('_id') || model.get('id'),
      });
      return list
    };

    // if key is backspace and title is empty
    // and the list doesn't have childs
    // delete it
    if (e.keyCode === 8 && titleInput.val().length === 0  && this.model.children.length === 0) {
      this.model.destroy();
    }

    if (e.keyCode === 13) {

      // update this model then create a new one and focus on it
      this.model.set('title', this.$('>.edit-input').val());

      if (this.model.get('state') === 'open') {
        // just create a new node
        var list = new List({
          parent_id: this.model.get('_id')
        });
      
      } else if (this.model.get('state') === 'collapsed') {
        var parent_id = this.model.get('parent_id') || null;
        var list = new List({
          parent_id: parent_id
        });
      };
      // save the model
      list.save(list.toJSON(), {wait:true})
      // emit event to add the model to the collection
      Emitter.trigger('collection:lists:add', {model: list});
    }
  },

  edit: function(e) {
    // stop event
    e.stopImmediatePropagation();
    // add editing class
    this.$el.addClass('editing');
    var input = this.$('>.edit-input');
    input.show().focus().val(this.model.get('title'));
    this.$('>.title').hide();
  },

  editNote: function(e) {
    e.stopImmediatePropagation();
    this.$el.addClass('editing');

    // autogrow plugin
    this.focusNote();
  },

  blurNote: function(e) {
    e.stopImmediatePropagation();
    this.$el.removeClass('editing');
    this.model.set('note', this.$('>.edit-note').val());
    this.$('>.note').show();
    this.$('>.edit-note').hide();
  },

  focusNote: function(e)  {
    var note = this.$('>.note');
    note.hide();
    var input = this.$('>.edit-note');
    input.show().focus().val(this.model.get('note')).css('height', note.outerHeight() + 20);
  },

  focus: function() {
    var input = this.$('>.edit-input');
    input.show().focus().val(this.model.get('title'));
    this.$('>.title').hide();
  },

  deleteModel: function() {
    this.model.destroy();
  },

  blur: function(e) {
    e.stopImmediatePropagation();
    // remove editing class
    this.$el.removeClass('editing');
    this.model.set('title', this.$('>.edit-input').val());
    this.$('>.title').show();
    this.$('>.edit-input').hide();
  },

  collapse: function(e) {
    e.stopImmediatePropagation();
    this.$('>ul.children').slideUp('meduim', function() {
      // jquery adds overflow hidden automaticly when animating
      $(this).css('overflow', 'visible')
    });
    //this.$el.addClass('collapsed').removeClass('open');
    this.model.set('state', 'collapsed');
    this.$('>.collapse').addClass('show').removeClass('collapse').text('+');
  },

  show: function(e) {
    e.stopImmediatePropagation();
    //this.$el.addClass('open').removeClass('collapsed');
    this.$('>ul.children').slideDown('meduim', function() {
      $(this).css('overflow', 'visible')
    });
    this.model.set('state', 'open');
    this.$('>.show').addClass('collapse').removeClass('show').text('-');
  },

  render: function() {
    //this.$el.html('<span class="collapse">-</span><span class="circle"></span><span class="txt">' + this.model.get('title') + '</span><ul class="child"></ul>');
    this.$el.html(this.template(this.model.toJSON())).data('cid', this.model.cid);
    this.trigger('render');
    return this
  },


});


module.exports = ListView;
