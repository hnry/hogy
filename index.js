var fs = require('fs')
  , hoganjs = require('hogan.js')
  , path = require('path');

var basePath = path.dirname()
//  , cache = {}
  , partialsCompiled = {};
var file_partials = {};

function ProcessPartials(partialFiles, partialsIndex, file, options, fn) {
  var pp = this
    , at_partial = 0;

  this.next = function() {
    var partialName = partialsIndex[at_partial]
      , partialFile = file_partials[partialsIndex[at_partial]]
      , cachedPartial;

    // done
    if (!partialName || !partialFile) {
      exports.done(file, options, fn);
      return;
    }

    if (partialFile != '/') partialFile = '/' + partialFile
/* cache code
    cachedPartial = exports.getCache(options, basePath + partialFile);
    if (cachedPartial) {
      console.log('cache > ' + partialFile);
      partialsCompiled[partialName] = cachedPartial
      at_partial += 1;
      pp.next();
    } else { */
      exports.compile(basePath + partialFile, options, function(fileCompiled) {
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
  var partialsIndex = [];
  basePath = path.dirname(file);

  if (!file_partials) {
    exports.done(file, options, fn);
    return;
  }

  for (var f in file_partials) { partialsIndex.unshift(f); }
  var pp = new ProcessPartials(file_partials, partialsIndex, file, options, fn);
  pp.next();
}

exports.init = function(partialsList) {
  file_partials = partialsList;
  // alias to exports.render
  // makes require statement shorter
  return exports.render;
}

exports.__express = exports.render;
