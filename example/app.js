var express = require('express')
  , http = require('http');
var app = express();

var partials = {
    partial: 'partial.html',
    'partial2': 'another_partial.html'
  }
  , hogy = require('../').init(partials);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.engine('html', hogy);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
  res.render('index', {
    title: 'This is a variable',
    partial: { partial: 'This will overwrite the original partial tag' }
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
