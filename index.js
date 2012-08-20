var fs = require('fs')
  , hoganjs = require('hogan.js');

var partialsCompiled = {}
  , initPartials = {};

function ProcessPartials(partials, q, file, options, fn) {
  var pp = this
    , at_partial = 0;

  this.next = function() {
    // check if done
    if (!q[at_partial] || !partials[q[at_partial]]) {
      exports.done(file, options, pp, fn);
      return;
    }

    var partialName = q[at_partial]
      , partialFile = partials[q[at_partial]];

      exports.compile(partialFile, options, true, function(fileCompiled) {
        partialsCompiled[partialName] = fileCompiled;
        at_partial += 1;
        pp.next();
      });
  }
}

/*
  checks if caching true and retrieves cache
  otherwise returns false

  partial param can be file name or text of partial
*/
exports.checkCache = function(partial, options, filemodtime) {
  filemodtime = filemodtime || undefined
  if (options.cache && hoganjs.cache[partial]) {
    return hoganjs.cache[partial];
  } else {
    return false;
  }
}

/*
  updates cache
*/
exports.storeCache = function() {
}

exports.compile = function(partial, options, fixpath, callback) {
  var file = options.settings.views
    , cache;
  // fix path for partials only
  (fixpath && partial != '/') ? file = file + '/' + partial : file = partial;

  fs.stat(file, function(err, stat){
    if (err) {
      // not a file, compile as a string or function
      cache = checkCache(partial, options);
      if (cache) {
        callback(cache)
      } else {
        var compiled = hoganjs.compile(partial);
        callback(compiled);
      }
    } else {
      cache = checkCache(file, options, stat.mtime);
      if (cache) {
        callback(cache);
      } else {
        fs.readFile(file, 'utf8', function(err, data) {
          if (err) {
            throw new Error(err); // file read error
          } else {
            //var fileParse = hoganjs.parse(hoganjs.scan(data), data);
            var compiled = hoganjs.compile(data);
            callback(compiled);
          }
        });
      }
    }
  });
}

/*
  after all partials compile then render the original file
*/
exports.done = function(file, options, pp, fn) {
  delete(pp); // pp obj no longer needed
  exports.compile(file, options, false, function(fileCompiled) {
    fn(null, fileCompiled.render(options, partialsCompiled));
  });
}

exports.render = function(file, options, fn) {
  var q = []
    , partials = {};

  // add initial partials to the queue
  for (var tag in initPartials) {
    q.unshift(tag);
    partials[tag] = initPartials[tag];
  }
  // add local routes partials to the queue
  for (var tag in options.partials) {
    q.unshift(tag);
    partials[tag] = options.partials[tag];
  }

  var pp = new ProcessPartials(partials, q, file, options, fn);
  pp.next();
}

/*
  also alias to exports.render
*/
exports.init = function(partialsList) {
  initPartials = partialsList;
  return exports.render;
}

exports.__express = exports.render;
