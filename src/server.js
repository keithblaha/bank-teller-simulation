define(['http', 'express', 'consolidate', 'lodash', 'less-middleware', 'mongodb', 'src/ioConf'],
function(http,   express,   cons,          _,        lessMiddleware,    mongo,     ioConf) {
  return function() {
    var app = express();
    var isDevMode = app.get('env') === 'development';
    var isProdMode = app.get('env') === 'production';
    var contextPath = isProdMode ? '/demos/sim' : '';
    var baseDir = requirejs.toUrl('');
    var port = process.env.PORT || 3000;

    if(isProdMode) {
      app.enable('trust proxy');
    }

    app.use(lessMiddleware('less', {
      dest: 'less/compiled',
      pathRoot: baseDir,
      preprocess: {
        path: function(pathname, req) {
          return pathname.replace(/\/static\/css/, '');
        }
      },
      force: isDevMode,
      once: isProdMode
    }));
    app.use('/static/css', express.static(baseDir + 'less/compiled/static/css'));

    if(isDevMode) {
      app.use('/static', express.static(baseDir + 'third_party'));
      app.use('/static/js', express.static(baseDir + 'require/js'));
      app.use('/static/templates', express.static(baseDir + 'require/templates'));
    }
    if(isProdMode) {
      var config = {
        baseUrl: baseDir + 'require/js',
        name: 'Sim',
        paths: {
          backbone: 'empty:',
          jquery: 'empty:',
          'jquery.event.drag': 'empty:',
          lodash: 'empty:',
          raphael: 'empty:',
          'socket.io': 'empty:',
          underscore: 'empty:',
          webfont: 'empty:',

          text: '../../third_party/js/text',
          templates: '../templates'
        },
        stubModules: ['text'],
        out: baseDir + 'require/js/compiled/Sim.min.js'
      };
      requirejs.optimize(config, function(built) {
        var contents = fs.readFileSync(config.out, 'utf-8');
      }, function(err) {
        console.error(err);
      });

      app.use('/static/js', express.static(baseDir + 'require/js/compiled'));
    }
    app.use('/static', express.static(baseDir + 'public'));

    app.engine('html', cons.lodash);
    app.set('view engine', 'html');
    app.set('views', baseDir + 'views');

    app.get('/', function(req, res, next) {
      var branding;
      var brands = [];
      _.each(brands, function(brand) {
        if(req.param(brand) === '1') {
          branding = brand;
        }
      });
      res.render('index', {contextPath: contextPath, isDevMode: isDevMode, isProdMode: isProdMode, branding: branding});
    });

    app.use(function(req, res, next) {
      res.status(404);
      res.format({
        html: function() {
          res.render('404');
        }
      });
    });

    var startIo = function(db) {
      var server = http.Server(app);
      ioConf(server, db, {
        'log level': 1
      });
      server.listen(port);
    }

    /*
    if(isDevMode) {
      mongo.connect('mongodb://127.0.0.1:27017/sim', function(err, db) {
        if(err) {
          throw err;
        }
        else {
          startIo(db);
        }
      });
    }
    else {
    */
      startIo();
    //}
  }
});
