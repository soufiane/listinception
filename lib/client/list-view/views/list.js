var Backbone            = require('backbone'),
    Emitter             = require('emitter'),
    List                = require('list'),
    listTemplate        = require('../templates/list'),
    _                   = require('underscore'),
    $                   = require('jquery'),
    jqueryUi            = require('jquery-ui'),
    moment              = require('moment'),
    ActionTooltipView   = require('./action-tooltip'),
    progress            = require('progress');



/*
 * TODO
 * 1. move this to another file
 */

var dragHelper = $('<div class="drag-helper"></div>').appendTo(document.body),
    sortable   = null;

// remove this
setTimeout(function() {
  sortable = $('.root').sortable({
    handle: '>.drag',
    items: '.node',
    placeholder: "drop-placeholder",
    tolerance: 'pointer',
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

  /*
   * Change sort options based on view change
   */

  Emitter.on('view-changer:change', function(view) {
    if (view === 'tree-view') {
      sortable.sortable('option', {
        'tolerance': 'intersect',
        'toleranceElement': '>.title'
      });

    } else if (view === 'board-view') {
    }
  })


  console.log('sortable now');



}, 1000);


function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

var ListView = Backbone.View.extend({

  tagName: 'li',
  className: 'node',
  template: listTemplate,

  events: {
    'click .title': 'edit',
    'keydown .edit-input': 'create',
    'blur input': 'blur',
    'click .collapse': 'collapse',
    'click .show': 'show',
    'click .note': 'editNote',
    'blur .edit-note': 'blurNote',
    'sortupdate': 'updateOrder',
    'click a': 'decideLink', // open a new page if the link is external or search if the link is on the same domain
    'dragover': 'cancel',
    'dragenter': 'cancel',
    'drop': 'drop'
  },

  cancel: function(e) {
    e.stopPropagation();
    e.preventDefault();
    return false
  },

  drop: function(e) {
    e.stopPropagation();
    e.preventDefault();

    var self = this;

    var onProgress = function(evt) {
      if (evt.lengthComputable) {
        var percentComplete = Math.round(evt.loaded * 100 / evt.total);
        Emitter.trigger('progress:update', {percent: percentComplete + '%'});
      }

    };

    // validate the files
    // upload them
    // show progress bar
    // when done, add url to the note
    var files = e.originalEvent.dataTransfer.files;
    if (files && files.length) {
      // Only upload one file for now
      // make sure file is an image
      var file      = files[0];
      var formData  = new FormData(); 
      formData.append('image', file);
      var req = $.ajax({
          url: '/api/upload',
          type: 'POST',
          data: formData,
          contentType: false,
          processData: false,
          xhr: function() {
            var xhr = $.ajaxSettings.xhr();
            // add progress event
            xhr.addEventListener('progress', onProgress, false);
            // show the progress bar
            Emitter.trigger('progress:show');
            return xhr
          },
          always: function() {
            Emitter.trigger('progress:hide');
            // hide the progress bar
          }
      });

      req.done(function(data) {
        console.log(data);
        // update the note with the new image url
        var note = self.model.get('note');
        note += "\n![]("+ location + "uploads/" + data.path  +")";
        self.model.set('note', note);
      });

      req.always(function() {
        Emitter.trigger('progress:hide');
      });

      return false

    } else {
      Emitter.trigger('error:error', {errors: [{message: 'Please select a file.'}]});
    }
      
  },

  updateOrder: function (e) {
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
    // on hover create this view and display it


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
      model.save({state:state, user: model.get('user')}, {patch: true});
      console.log("saving, state")
    });


    // save changes to the note
    this.model.on('change:note', function(model, note) {
      that.$('>.note').html(model.get('md').note);
      // save the model
      model.save({note:note, user: model.get('user')}, {patch: true});
      console.log("saving, note");
    });

    //  save changes to title
    this.model.on('change:title', function(model, title) {
      //that.$('>.title').text(title);
      that.$('>.title').html(model.get('md').title);

        // save the model
      model.save({title: title, user: model.get('user')}, {patch: true});
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
      model.save({status: status, user:model.get('user')}, {patch:true});
    });

    // remove this view on destroy

    this.model.on('destroy', _.bind(this.onDestroy, this));

    // add status classes
    this.$el.addClass(this.model.get('status'));

    // list is shared, add a shared class to the el
    if (_.size(this.model.get('permissions')) > 1) {
      that.$el.addClass('shared');
    }



    // a hack to display the tooltip
    this.on('render', function() {
      
      that.$('>.circle').on('mouseenter', function(e) {
        e.stopImmediatePropagation()
        //that.$el.children().filter('li').find('>.toggle').css('visibility', 'hidden')

        //$('.node').removeClass('hover');

        //that.$el.addClass('hover');
        
        // append the tooltip to the offset
        var $t = $(this),
            css   = {
              top: $t.offset().top,
              left: $t.offset().left - 24
            };

         console.log(css);

        if (that.actionsViewTimeout) clearTimeout(that.actionsViewTimeout);

        that.actionsViewTimeout = setTimeout(function() {
          that.views.actionsView = new ActionTooltipView({model: that.model, parentView: that});
          that.views.actionsView.render().$el.appendTo('body').css(css);
        }, 1000);

        return false
      });

      that.$('>.circle').on('mouseleave', function(e) {
        e.stopImmediatePropagation()

        // remove the actions view
        if (that.actionsViewTimeout) {
          clearTimeout(that.actionsViewTimeout);
        }

        /*
        if (that.views.actionsView) {
          that.views.actionsView.destroy();
        }*/

        //$('.node').removeClass('hover');
        //var m = that.$('.toggle-' + that.model.get('_id')).css('visibility', 'hidden')
        return false
      });

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
    console.log(titleInput.val())
    if (e.keyCode === 8 && !titleInput.val()) {
      // delete the model and it's childs
      // move tht focus to the one before it

      var prev = this.$el.prev('.node').find('>.title');
      if (!prev.length) {
        var prev = this.$el.parents('.node:first').find('>.title');
      }

      // rewrite this.edit
      // so it won't update after deleting the model
      prev.trigger('click');

      this.model.destroy();
      return false
    };

    switch (e.keyCode) {

      // enter
      case 13:
        // update this model then create a new one and focus on it
        this.model.set('title', this.$('>.edit-input').val());

        if (this.model.get('state') === 'open') {
          // just create a new node
          var list = new List({
            parent_id: this.model.get('_id')
          });
          var after = null;
        } else if (this.model.get('state') === 'collapsed') {
          var parent_id = this.model.get('parent_id') || null;
          var list = new List({
            parent_id: parent_id
          });
          var after = this.$el;
        };
        // save the model
        list.save(list.toJSON(), {wait:true})
        // emit event to add the model to the collection
        Emitter.trigger('collection:lists:add', {model: list, insertAfter: after});
        break;
      // Top arrow key
      case 38:
        // find sibling if sibgling, use else find parent
        var prevNode = this.$el.prev('.node');
        if (prevNode.length) {
          this.$el.prev('.node').find('>.title').trigger('click');
        } else {
          this.$el.parents('.node:first').find('>.title').trigger('click');
        }
        break;
      // Bottom arrow key
      case 40:
        var nextNode = this.$el.next('.node');
        if (nextNode.length) {
          this.$el.next('.node').find('>.title').trigger('click');
        } else {
          this.$('>.children >.node:first').find('>.title').trigger('click');
        }
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

  decideLink: function(e) {
    e.stopImmediatePropagation()
    var href = $(e.currentTarget).attr('href');
    if (href && href.indexOf('search') !== 0) {
      var tag = href
                  .replace('/search/', "")
                  .replace('%23', "#");

      // should search the document
      Emitter.trigger('search:search', tag);
    }
    return false
  }

});


module.exports = ListView;
