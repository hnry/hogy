var should = require('should');
var hogy = require('../index');


var options;

describe('hogy', function() {

  beforeEach(function() {
    options = {};
    options.settings = { views: '', 'view engine': 'html' }
  });

  it('renders', function(done) {
    var render = hogy.init();
    options.test = '123';

    render('hi {{test}}', options, function(err, results) {
      should.not.exist(err);
      results.should.equal('hi 123');
      done();
    });
  })


  it('renders default partials', function(done) {
    var render = hogy.init({'layout': '!layout'});
    options.test = '1234';

    render('{{>layout}} hi {{test}}', options, function(err, results) {
      should.not.exist(err);
      results.should.equal('!layout hi 1234');
      done();
    });
  })

  it('renders local partials', function(done) {
    var render = hogy.init({'layout': '!layout'});
    options.test = '12345';
    options.partials = {'local': '+local'};

    render('{{>layout}} hi {{test}} {{>local}}', options, function(err, results) {
      should.not.exist(err);
      results.should.equal('!layout hi 12345 +local');
      done();
    });
  })


  it('delimiters', function(done) {
    var render = hogy.init({'layout': '!layout'});
    options.test = '123';
    options.partials = {'local': '+local'};
    options.delimiters = '-% %-';

    render('-%>layout%- hi -%test%- -%>local%-', options, function(err, results) {
      should.not.exist(err);
      results.should.equal('!layout hi 123 +local');
      done();
    });
  })

  it('caches')

});