var fs = require('fs')
  , hoganjs = require('hogan.js')
  , path = require('path');

//  , cache = {}
var partialsCompiled = {};

var initPartials = {};

function ProcessPartials(partials, q, file, options, fn) {
  var pp = this
    , at_partial = 0;

  this.next = function() {
    // check if done
    if (!q[at_partial] || !partials[q[at_partial]]) {
      exports.done(file, options, fn);
      return;
    }

    var partialName = q[at_partial]
      , partialFile = partials[q[at_partial]]
      , cachedPartial;

    console.log(partialName + '>' + partialFile);
    if (partialFile != '/') partialFile = '/' + partialFile
/* cache code
    cachedPartial = exports.getCache(options, basePath + partialFile);
    if (cachedPartial) {
      console.log('cache > ' + partialFile);
      partialsCompiled[partialName] = cachedPartial
      at_partial += 1;
      pp.next();
    } else { */
      exports.compile(options.settings.views + partialFile, options, function(fileCompiled) {
        partialsCompiled[partialName] = fileCompiled;
        at_partial += 1;
        pp.next();
      });
    //} cache code
  }
}

/* cache code
exports.getCache = function(options, file) {
  if (options.cache && cache[file]) {
    return cache[file]; } else { return false; }
}
exports.storeCache = function(options, file, fileCompiled) {
  if (options.cache) cache[file] = fileCompiled;
}
*/

exports.compile = function(file, options, callback) {
  fs.readFile(file, 'utf8', function(err, data) {
    if (err) throw new Error('couldn\'t read file: ' + file);
    //var fileParse = hoganjs.parse(hoganjs.scan(data), data);
    //console.log(fileParse);
    var fileCompiled = hoganjs.compile(data);
    //exports.storeCache(options, file, fileCompiled);
    callback(fileCompiled);
  });
}

/*
  after all partials compile then render the original file
*/
exports.done = function(file, options, fn) {
  // TODO check cache before compiling
  exports.compile(file, options, function(fileCompiled) {
    fn(null, fileCompiled.render(options, partialsCompiled));
  });
}

exports.render = function(file, options, fn) {
  var q = []
    , partials = {};

  // add local routes partials to the queue
  for (var tag in options.partials) {
    q.unshift(tag);
    partials[tag] = options.partials[tag];
  }
  // add initial partials to the queue
  for (var tag in initPartials) {
    q.unshift(tag);
    partials[tag] = initPartials[tag];
  }

  var pp = new ProcessPartials(partials, q, file, options, fn);
  pp.next();
}

exports.init = function(partialsList) {
  initPartials = partialsList;
  // alias to exports.render
  // makes require statement shorter
  return exports.render;
}

exports.__express = exports.render;
