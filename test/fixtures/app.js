var path = require('path'),
    flatiron = require('flatiron'),
    app = module.exports = flatiron.app;
    
app.use(flatiron.plugins.cli, {
  usage: 'A CLI app test fixture'
});

app.inspect = require('cliff');
app.use(require('../../lib/cli-config'), {
  //
  // TODO: Options here?
  //
});

app.config.file({ file: path.join(__dirname, 'test-config.json') });

if (!module.parent) {
  app.start();
}
