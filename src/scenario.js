define(['lodash'], function(_) {
  var Scenario = function(characterInfo, dialogue, rules, plot, initialItems, correctAction) {
    this.characterInfo = characterInfo;
    this.rules = rules;
    this.dialogue = dialogue
    this.plot = plot;
    this.items = initialItems;
    this.correctAction = correctAction;
  };

  var p = Scenario.prototype;

  p.isCorrectAction = function(action) {
    return action === this.correctAction;
  };

  p.getGameData = function() {
    return {
      c: this.characterInfo,
      d: this.dialogue,
      r: this.rules,
      i: this.items
    }
  };

  p.evaluateCorrelation = function(corrId1, corrId2) {
     return this.plot.evaluateCorrelation(corrId1, corrId2);
  };

  return Scenario;
});
