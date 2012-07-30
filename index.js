var fs = require('fs')
  , hoganjs = require('hogan.js')
  , path = require('path');

// just for testing purposes at the moment
var file_partials = {
  top: '/views/top.hjs', bottom: '/views/bottom.hjs' };

var cache = {}
  , partialsCompiled = {};

function ProcessPartials(partialFiles, partialsIndex, file, options, fn) {
  var pp = this
    , at_partial = 0;

  this.next = function() {
    var partialName = partialsIndex[at_partial]
      , partialFile = file_partials(partialsIndex[at_partial]);

    // done
    if (!partialName || !partialFile) {
      exports.done(file, options, partialsCompiled, fn);
      return;
    }

    if (options.cache && cache[partialFile]) {
      partialsCompled[partialName] = cache[partialFile];
      at_partial += 1;
      pp.next();
    } else {
      exports.compile(function() {
        at_partial += 1;
        pp.next();
      });
    }
  }
}

exports.checkCache = function(file) {
  options.cache && cache[file] ? return cache[file] : return false;
}

exports.storeCache = function(file, fileCompiled) {
  options.cache ? cache[file] = fileCompiled;
}

exports.compile = function(file, options, callback) {
  fs.readFile(file, 'utf8', function(err, data){
    if (err) throw new Error('couldn\'t read file: ' + path.dirname() + partialFile);
    var fileCompiled = hoganjs.generate();
    exports.storeCache(file, fileCompiled);
    callback();
  });
}

exports.done = function(fileCompiled, options, partialsCompiled, fn) {
  // compile the original file to be rendered
  fn(null, fileCompiled(options, partialsCompiled));
}

exports.render = function(file, options, fn) {
  var partialsIndex = [];

  for (var f in file_partials) { fileIndex.unshift(f); }

  var pp = new ProcessPartials(file_partials, partialsIndex, file, options, fn);
  pp.next();
};

exports.__express = exports.render;
