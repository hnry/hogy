# hogy
hogan.js templates for express 3.x

Supports file partials. Ability to pass partials to all views in or just to specific routes.

## Usage

In order to use file partials, you have to make hogy aware of them. To do this, you just create a object that maps the partial tag to the actual file and pass the object to hogy.

Example app.js:
```
...
// partials declared here will be available to all views
// file extension optional
var partials = { top: 'layout-top', bottom: 'layout-bottom' };

var hogy = require('hogy').init(partials); // setup hogy

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hogan'); // 'hogan' is whatever file extension you want
  app.engine('hogan', hogy);

...
```

If you don't have any file partials you want available to all views, you can simply just do:
```
    var hogy = require('hogy').init();
```

hogy also supports local partials specific for each route.
Local partials can override partials declared during setup.

See example for more complete usage.

## License

(The MIT License)

Copyright (c) 2012 henwy <https://github.com/henwy>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
