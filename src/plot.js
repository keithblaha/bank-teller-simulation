define(['lodash'], function(_) {
  var Plot = function(tree) {
    this.tree = tree || {};
  };

  var p = Plot.prototype;

  p.evaluateCorrelation = function(corrId1, corrId2) {
    var k1 = corrId1 + ':' + corrId2;
    var k2 = corrId2 + ':' + corrId1;
    var plotBranch = this.tree[k1] || this.tree[k2];
    if(!_.isUndefined(plotBranch) && !plotBranch.isAdvanced) {
      plotBranch.isAdvanced = true;
      return plotBranch.gameData;
    }
    else {
      return {};
    }
  };

  return Plot;
});
