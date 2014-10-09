define(['backbone'], function() {
  return Backbone.Model.extend({

    name: '',
    viewClass: null,

    constructor: function(sim) {
      Backbone.Model.apply(this, arguments);
      this.view = (new (this.viewClass)({model: sim}, this.name)).render();
    }
  });
});
