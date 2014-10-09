define(['lodash', 'socket.io', 'src/scenarios'], function(_, io, baseScenarios) {
  return function(server, db, conf) {
    var ioConf = io.listen(server, conf);
    ioConf.sockets.on('connection', function(socket) {
      var scenarios = baseScenarios;
      var currentScenario = scenarios[0];
      var nextScenario = 1;
      var beginTime;
      var completeTime;
      var results = [];
      var metrics = [];
      _.each(scenarios, function() {
        metrics.push({});
      });
      socket.on('ready', function() {
        socket.emit('begin', currentScenario.getGameData());
        beginTime = _.now();
      });
      socket.on('action', function(data) {
        completeTime = _.now();
        results.push({
          correct: currentScenario.isCorrectAction(data.action),
          time: completeTime - beginTime
        });
        beginTime = completeTime;
        if(nextScenario < scenarios.length) {
          currentScenario = scenarios[nextScenario++];
          socket.emit('advance', currentScenario.getGameData());
        }
        else {
          socket.emit('end', results);
          if(!_.isUndefined(db)) {
            db.collection('metrics').insert({
                player: 'keith',
                metrics: metrics,
                results: results
              }, function(err, result) {
                if(err) {
                  throw err;
                }
              }
            );
          }
        }
      });
      socket.on('metric', function(data) {
        _.merge(metrics[data.scenario], data.metrics)
      });
      socket.on('correlation', function(data) {
        var correlationResponse = currentScenario.evaluateCorrelation(data.corrId1, data.corrId2);
        socket.emit('update', correlationResponse);
      });
    });
  };
});
