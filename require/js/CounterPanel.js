define(['SimPanel', 'SimPanelView', 'text!templates/check.html', 'text!templates/deposit.html', 'text!templates/withdrawal.html', 'backbone', 'lodash', 'raphael', 'jquery.event.drag'],
function(SimPanel,   SimPanelView,   checkTemplate,               depositTemplate,               withdrawalTemplate) {

  var CounterPanelView = SimPanelView.extend({
    id: 'counter',
    panelContainer: 'bottom-container',

    listeners: {
      'correct-correlation': 'addItems'
    },

    postConstructor: function() {
// todo - multiple templates for checks
      this.itemTemplates = _.transform({
        check: checkTemplate,
        deposit: depositTemplate,
        withdrawal: withdrawalTemplate
      }, function(result, template, item) {
        result[item] = _.template(template);
      });
    },

    render: function() {
      this.$el.html('');
      this.drawItems(this.model.get('i'));
      return this;
    },

    addItems: function(updateData) {
      if(!_.isUndefined(updateData.i)) {
        this.drawItems(updateData.i);
      }
    },

    drawItems: function(items) {
      var counterOffset = this.$el.offset();
      var counterBottom = counterOffset.top + this.$el.height();
      var nextTop = counterOffset.top + 25;
      var nextLeft = counterOffset.left + 50;
      var formatItemData = function(value, index) {
        var formattedValue = value;
        if(_.isNumber(value)) {
          formattedValue = value.toFixed(2);
        }
        else if(_.isString(value) && _.isEmpty(value)) {
          formattedValue = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        }
        return {
          i: index,
          v: formattedValue
        }
      };
      _.each(items, function(item, i) {
        var corrIdBase = 'i' + i;
        var templateData = _.transform(item.data, function(r, v, k) {
          if(_.isArray(v)) {
            r[k] = _.map(v, function(vv, ii) {
              return formatItemData(vv, corrIdBase + k + ii);
            });
          }
          else {
            r[k] = formatItemData(v, corrIdBase + k);
          }
        });
        templateData.id = 'item' + i;
        var $item = $(this.itemTemplates[item.type](templateData)).appendTo(this.el);

        var outerHeight = $item.outerHeight(true);
        if(nextTop + outerHeight > counterBottom) {
          nextTop = counterOffset.top + 75;
          nextLeft = nextLeft + 100;
        }
        $item.css({
          top: nextTop,
          left: nextLeft
        });
        nextTop += $item.outerHeight(true) + 5;
      }, this);

      var baseLimit = {
        left: counterOffset.left,
        top: counterOffset.top,
        right: counterOffset.left + this.$el.outerWidth(),
        bottom: counterOffset.top + this.$el.outerHeight()
      };
      var appendToEl = this.el;
      var sim = this.model;
      this.$el.find('.draggable')
        .drag('start', function(e, dd) {
          sim.logEventMetric('begin-drag', {
            id: sim.getEventId(e)
          });
          var $this = $(this);
          $this.appendTo(appendToEl);
          dd.limit = _.clone(baseLimit);
          dd.limit.bottom -= $this.outerHeight(true);
          dd.limit.right -= $this.outerWidth(true);
        })
        .drag(function(e, dd) {
          $(this).css({
            top:  _.min([dd.limit.bottom, _.max([dd.limit.top, dd.offsetY])]),
            left: _.min([dd.limit.right, _.max([dd.limit.left, dd.offsetX])])
          });
        }, {
          not: '.correlate-mode .info'
        })
        .drag('end', function(e, dd) {
          sim.logEventMetric('end-drag', {
            id: sim.getEventId(e)
          });
        });
    }
  });

  return SimPanel.extend({
    name: 'counter',
    viewClass: CounterPanelView
  });
});
