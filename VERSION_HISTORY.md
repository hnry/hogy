## 0.0.5

  * file extension when declaring file partials is optional

## 0.0.4

  * fix partialsCompiled to be local to pp object

  * code clean up; minor bug fixes

## 0.0.3

  * performance improvements (less file reads), better caching

  * make hogan.js caching follow express options.cache

## 0.0.2

  * added support for local route partials, they should have priority over any other partial

  * check if partial processing queue is done earlier, fixes error when no initial partials are given

  * bug fix, remove basePath, use options.settings.views instead

## 0.0.1

   * initial release
