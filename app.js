var requirejs = require('requirejs');

requirejs.config({
  nodeRequire: require,
  baseUrl: __dirname
});

requirejs(['src/server'], function(server){
  server();
});
