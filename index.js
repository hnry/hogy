var fs = require('fs')
  , hoganjs = require('hogan.js');

var fileCache = {}
  , initPartials = {};

function ProcessPartials(partials, q, file, options, fn) {
  var pp = this
    , at_partial = 0;
  this.partialsCompiled = {}; // previously completed partials required to render file

  this.next = function() {
    // check if done
    if (!q[at_partial] || !partials[q[at_partial]]) {
      exports.done(file, options, pp, fn);
      return;
    }

    var partialName = q[at_partial]
      , partialFile = partials[q[at_partial]];

      exports.compile(partialFile, options, true, function(fileCompiled) {
        pp.partialsCompiled[partialName] = fileCompiled;
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
exports.getCache = function(partial, options, filemodtime) {
  filemodtime = filemodtime || undefined;
  if (options.cache && filemodtime && fileCache[partial] && fileCache[partial].mtime === filemodtime) {
    return hoganjs.cache[fileCache[partial].text + '||' + !!options.asString];

  } else if (options.cache && hoganjs.cache[partial + '||' + !!options.asString]) {
    return hoganjs.cache[partial + '||' + !!options.asString];

  } else {
    if (!options.cache) hoganjs.cache = {}; // no caching
    return false;
  }
}

/*
  updates hogy cache, only applies to files
*/
exports.updateCache = function(fname, ftext, fmtime, options) {
  if (options.cache) {
    fileCache[fname] = {text: ftext, mtime: fmtime};
  }
}

exports.testFileExt = function(str, ext) {
  var strLen = str.length - 1 // -1 to account for 0
    , extLen = ext.length - 1
    , strIndex = strLen - extLen;
  for (var i = 0; i < extLen; i++) {
    if (ext[i] != str[strIndex]) return false;
    strIndex += 1;
  }
  return true;
}

exports.compile = function(partial, options, fixpath, callback) {
  var file = options.settings.views
    , cache
    , compiled;
  // fix path for partials only
  (fixpath && partial != '/') ? file = file + '/' + partial : file = partial;

  // add file extension if none
  if (!exports.testFileExt(file, options.settings['view engine'])) file += '.' + options.settings['view engine'];

  fs.stat(file, function(statErr, stat){
    // if statErr, not a file, compile as a string
    statErr ? cache = exports.getCache(partial, options) : cache = exports.getCache(file, options, Date.parse(stat.mtime));

    if (cache) {
      callback(cache);
    } else {
      if (statErr) {
        compiled = hoganjs.compile(partial, options);
        callback(compiled);
      } else {
        fs.readFile(file, 'utf8', function(err, data) {
          if (err) {
            throw new Error(err); // file read error
          } else {
            compiled = hoganjs.compile(data, options); // hoganjs.parse(hoganjs.scan(data), data);
            callback(compiled);
            exports.updateCache(file, data, Date.parse(stat.mtime), options);
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
  exports.compile(file, options, false, function(fileCompiled) {
    fn(null, fileCompiled.render(options, pp.partialsCompiled));
  });
}

exports.render = function(file, options, fn) {
  var q = []
    , partials = {};

  // add initial partials to the queue
  for (var tag in initPartials) {
    q.push(tag);
    partials[tag] = initPartials[tag];
  }
  // add local routes partials to the queue
  for (var tag in options.partials) {
    q.push(tag);
    partials[tag] = options.partials[tag];
  }

  var pp = new ProcessPartials(partials, q, file, options, fn);
  pp.next();
}

exports.init = function(partialsList) {
  initPartials = partialsList;
  return exports.render; // also alias to exports.render
}

exports.__express = exports.render;
