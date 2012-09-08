var express = require('express')
  , http = require('http');
var app = express();

var partials = {
    partial: 'partial', // specifying file extension optional
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
    // local partials support
    partials: {
        str_partial: 'This will overwrite the original str_partial tag<br /><h3>another_partial.html called from local partial (str_partial):</h3>{{>partial2}}'
      , filepartial: 'partial_called_locally.html'
    }
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
