define(['SimPanel', 'SimPanelView', 'jquery', 'backbone', 'raphael'],
function(SimPanel,   SimPanelView) {

  var correlatingClass = 'correlating';
  var correlateModeClass = 'correlate-mode';
  var inProgressClass = 'in-progress';

  var OverlayPanelView = SimPanelView.extend({
    id: 'overlay',

    postConstructor: function() {
      this.paper = Raphael('overlay', this.$el.width(), this.$el.height());
    },

    listeners: {
      'mode:correlate': 'toggleCorrelateMode',
      'update': 'handleUpdate'
    },

    toggleCorrelateMode: function(isActivated) {
      this.getTopContainer().toggleClass(correlateModeClass, isActivated);
      if(isActivated) {
        this.$el.show();
        this.$correlating = null;
        this.$correlatingTo = null;
        this.correlationInProgress = false;
        this.bindInfo();
      }
      else {
        this.unbindInfo();
        if(!_.isNull(this.$correlating)) {
          this.$correlating.removeClass(correlatingClass);
        }
        this.$el.hide();
      }
    },

    isInModulePanel: function(target) {
      return $.contains(this.getPanelContainer('module'), target);
    },
    isInDialoguePanel: function(target) {
      return $.contains(this.getPanelContainer('dialogue'), target);
    },

    bindInfo: function() {
      $('.info').click($.proxy(function(e) {
        if(!this.correlationInProgress) {
          if(_.isNull(this.$correlating)) {
            if(this.isInModulePanel(e.target)) {
              this.trigger('deactivate:module');
            }
            if(this.isInDialoguePanel(e.target)) {
              this.trigger('deactivate:dialogue');
            }
            this.$correlating = $(e.target).toggleClass(correlatingClass);
          }
          else {
            if(this.$correlating[0] === e.target) {
              if(this.isInModulePanel(e.target)) {
                this.trigger('reactivate:module');
              }
              if(this.isInDialoguePanel(e.target)) {
                this.trigger('reactivate:dialogue');
              }
              this.$correlating.removeClass(correlatingClass);
              this.$correlating = null;
            }
            else {
              this.$correlatingTo = $(e.target).addClass(correlatingClass);
              this.beginCorrelating();
              this.drawCorrelatingLine();
            }
          }
        }
      }, this));
    },

    unbindInfo: function() {
      $('.info').unbind();
    },

    beginCorrelating: function() {
      this.correlationInProgress = true;
      this.updateData = null;
      this.getTopContainer().addClass(inProgressClass);
      this.trigger('correlating', this.$correlating, this.$correlatingTo);
    },

    endCorrelating: function() {
        var correct = false;
        if(!_.isNull(this.updateData)) {
          this.$correlating.removeClass(correlatingClass);
          this.$correlatingTo.removeClass(correlatingClass);
          this.$correlating = null;
          this.$correlatingTo = null;
          this.getTopContainer().removeClass(inProgressClass);
          this.correlationInProgress = false;
          if(!_.isEmpty(this.updateData)) {
            correct = true;
            this.toggleMode('correlate', false);
            this.trigger('correct-correlation', this.updateData);
            this.unbindInfo();
          }
          else {
            this.showMessage();
          }
          this.updateData = null;
          this.paper.clear();
          this.trigger('done-correlating', correct);
        }
        else {
// todo - add maximum wait time
          setTimeout($.proxy(this.endCorrelating, this), 10);
        }
    },

    drawCorrelatingLine: function() {
      var o1 = this.$correlating.offset();
      var w1 = this.$correlating.outerWidth();
      var h1 = this.$correlating.outerHeight();
      var o2 = this.$correlatingTo.offset();
      var w2 = this.$correlatingTo.outerWidth();
      var h2 = this.$correlatingTo.outerHeight();
      var lx1, lx2, rx1, rx2;
      if(o1.left > o2.left) {
        lx1 = o2.left;
        lx2 = o2.left + w2;
        rx1 = o1.left;
        rx2 = o1.left + w1;
      }
      else {
        lx1 = o1.left;
        lx2 = o1.left + w1;
        rx1 = o2.left;
        rx2 = o2.left + w2;
      }
      var sideLeeway = 100;
      var middleLeeway = 20;
      var isOverlapping = rx1 <= (lx2 + middleLeeway);
      var isFarLeft = lx1 <= sideLeeway;
      var isFarRight = rx2 >= this.getTopContainer().width() - sideLeeway;
      var drawOnRight = isFarLeft || (!isFarRight && Math.random() > 0.5);
      var x1, x2;
      if(isOverlapping) {
        x1 = o1.left;
        x2 = o2.left;
        if(drawOnRight) {
          x1 += w1;
          x2 += w2;
        }
      }
      else {
        if(o1.left + w1 > o2.left + w2) {
          x1 = o1.left;
          x2 = o2.left + w2;
        }
        else {
          x1 = o1.left + w1;
          x2 = o2.left;
        }
      }
      var co = this.getTopContainer().offset();
      x1 -= co.left;
      x2 -= co.left;
      var y1 = o1.top + h1 / 2 - co.top;
      var y2 = o2.top + h2 / 2 - co.top;

      var mx;
      if(isOverlapping) {
        if(drawOnRight) {
          mx = _.max([x1, x2]) + middleLeeway;
        }
        else {
          mx = _.min([x1, x2]) - middleLeeway;
        }
      }
      else {
        mx = (x2 + x1) / 2;
      }
      var pathStart = 'M' + x1 + ',' + y1;
      var pathParts = [
        'H' + mx,
        'V' + y2,
        'L' + x2 + ',' + y2
      ];

      var correlatingLineTemplate = this.paper.path('').attr({
        fill: 'none',
        stroke: 'red',
        'stroke-dasharray': '-',
        'stroke-width': 2
      });

      var correlatingLine = correlatingLineTemplate.clone().attr({
        path: pathStart
      }).hide();
      var currentPath = correlatingLine.attr('path').toString();
      var currentLength = 0;
      var lastLength = 0;
      var totalLength = 0;
      var currentBegin = {x: x1, y: y1};
      var segments = _.map(pathParts, function(pathPart) {
        currentPath += ',' + pathPart;
        correlatingLine.attr('path', currentPath);
        totalLength = correlatingLine.getTotalLength();
        currentLength = totalLength - lastLength;
        lastLength = currentLength;
        var p =  currentBegin;
        currentBegin = correlatingLine.getPointAtLength(totalLength);
        return {
          pathStart: 'M' + p.x + ',' + p.y,
          pathPart: pathPart,
          length: currentLength
        }
      });

      var totalMillis = 400;
      var callback;
      var animation;
      var sLineAnimator = function(s, sLine, callbackFunc) {
        return function() {
          sLine.animate(
            Raphael.animation(
              {
                path: s.pathStart + s.pathPart
              },
              Math.round(totalMillis * s.length / totalLength),
              'linear',
              callbackFunc
            )
          );
        };
      };
      _.each(segments.reverse(), function(s, i) {
        var sLine = correlatingLineTemplate.clone().attr({
          path: s.pathStart
        });

        if(i === segments.length - 1) {
          sLineAnimator(s, sLine, callback)();
        }
        else {
          if(i === 0) {
            callback = $.proxy(function() {
              setTimeout($.proxy(function() {
                this.endCorrelating();
              }, this), 100);
            }, this);
          }
          animation = sLineAnimator(s, sLine, callback);
          callback = animation;
        }
      }, this);
    },

    handleUpdate: function(data) {
      this.updateData = data;
    },

    showMessage: function() {
      $('.popup').stop().remove();
      $('<div>')
        .html('<span>No correlation detected.</span>')
        .addClass('popup')
        .appendTo(this.getTopContainer())
        .fadeIn(0)
        .delay(500)
        .fadeOut(1000, function(){this.remove()});
    }
  });

  return SimPanel.extend({
    name: 'overlay',
    viewClass: OverlayPanelView
  });
});
