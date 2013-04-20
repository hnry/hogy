var should = require('should')
  , hogy = require('../index');

describe('unit', function() {

  it('testFileExt', function() {
    var result;
    result = hogy.testFileExt('blah.html', 'html');
    result.should.be.ok;

    result = hogy.testFileExt('blah.html', 'txt');
    result.should.not.be.ok;
  })


  it('getCache')

  it('updateCache')

  it('compile', function(done) {
    var options = { 
      settings: { 'view engine': 'html' },
      partials: { test: 'test' }
    };
    var partial = '{{test}} string';

    hogy.compile(partial, options, true, function(result) {
      result.render(options.partials).should.be.equal('test string');
      done();
    })
  })

})