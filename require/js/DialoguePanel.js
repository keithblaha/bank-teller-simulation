define(['SimPanel', 'SimPanelView', 'text!templates/dialogue_container.html', 'text!templates/dialogue.html', 'backbone'],
function(SimPanel,   SimPanelView,   dialogueContainerTemplate,                dialogueTemplate) {

  var DialoguePanelView = SimPanelView.extend({
    id: 'dialogue-panel',
    panelContainer: 'left-container',
    template: dialogueContainerTemplate,

    buttonClass: 'scroller',

    events: {
      'click .down': 'nextDialogue',
      'click .up': 'previousDialogue'
    },

    listeners: {
      'correct-correlation': 'addDialogues',
      'correlating': 'deactivate',
      'done-correlating': 'reactivate'
    },

    postRender: function() {
      this.$up = this.$el.find('.up');
      this.$down = this.$el.find('.down');
      this.dialogueTemplate = _.template(dialogueTemplate);
      this.$messages = this.$el.find('.messages');
      _.each(this.model.get('d'), function(d, i) {
        $(this.dialogueTemplate({d:d, i: i})).appendTo(this.$messages);
      }, this);
      this.animateDialogues(this.model.get('d'));
    },

    animateDialogues: function(dialogues) {
      this.trigger('deactivate:action');
      this.reportEventMetric('begin-dialogue-animation');
      var $c = $(this.dialogueTemplate({e: true, d: {a: true}}));
      $c.appendTo(this.$messages);
      var dialogueAnimator = function(dialogue, template, callbackFunc) {
        return function() {
          var d = _.omit(dialogue, 't');
          d.a = true;
          $c.html($(template({d: d})).html());
          $s = $c.find('span');
          var t = dialogue.t.split(' ');
          var counter = -2;
          var max = t.length;
          var interval = setInterval(function() {
            if(counter < max && counter >= 0) {
              $s.html(function(i, old) {
                return old + ' ' + t[counter];
              });
            }
            else if(counter > max + 1) {
              clearInterval(interval);
              callbackFunc();
            }
            counter++;
          }, 200);
        };
      };

      var callback;
      var currentAnimation;
      _.each(dialogues.reverse(), function(d, i) {
        if(i === 0) {
          callback = _.bind(this.endDialogueAnimation, this, $c);
        }
        else {
          callback = currentAnimation;
        }
        currentAnimation = dialogueAnimator(d, this.dialogueTemplate, callback);
      }, this);
      currentAnimation();
    },

    endDialogueAnimation: function($c) {
      this.currentDialogue = this.model.get('d').length - 1;
      $c.remove();
      $('#dialogue' + this.currentDialogue).addClass('current');
      if(this.currentDialogue > 0) {
        this.$up.removeClass('hidden');
      }
      this.trigger('reactivate:action');
      this.reportEventMetric('end-dialogue-animation');
    },

    printDialogue: function() {
      this.adjustScrollers();
      this.$el.find('.current').removeClass('current');
      $('#dialogue' + this.currentDialogue).addClass('current');
    },

    adjustScrollers: function() {
      var max = this.model.get('d').length - 1;
      if(max === 0) {
        this.$up.addClass('hidden');
        this.$down.addClass('hidden');
      }
      else {
        if(this.currentDialogue === 0) {
          this.$up.addClass('hidden');
        }
        if(this.currentDialogue === 1) {
          this.$up.removeClass('hidden');
        }
        if(this.currentDialogue === max) {
          this.$down.addClass('hidden');
        }
        if(this.currentDialogue === max - 1) {
          this.$down.removeClass('hidden');
        }
      }
    },

    nextDialogue: function(e) {
      if(this.isActive(e.target)) {
        this.currentDialogue++;
        this.printDialogue();
      }
    },

    previousDialogue: function(e) {
      if(this.isActive(e.target)) {
        this.currentDialogue--;
        this.printDialogue();
      }
    },

    addDialogues: function(updateData) {
      if(!_.isUndefined(updateData.d)) {
        var offset = this.model.get('d').length - updateData.d.length;
        _.each(updateData.d, function(d, i) {
          $(this.dialogueTemplate({d:d, i: offset + i})).appendTo(this.$messages);
        }, this);
        this.$up.addClass('hidden');
        this.$down.addClass('hidden');
        this.$el.find('.current').removeClass('current');
        this.animateDialogues(updateData.d);
      }
    }
  });

  return SimPanel.extend({
    name: 'dialogue',
    viewClass: DialoguePanelView
  });
});
