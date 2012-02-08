var path = require('path'),
    flatiron = require('flatiron'),
    app = module.exports = flatiron.app;

//
// Configure the Application to be a CLI app with
// a JSON configuration file `test-config.json`
//
app.name = 'app.js';
app.config.file({ file: path.join(__dirname, 'test-config.json') });
app.use(flatiron.plugins.cli, {
  usage: 'A simple CLI app using cli-config'
});

//
// Expose CLI commands using `cli-config`
//
app.use(require('../lib/cli-config'));

if (!module.parent) {
  //
  // Start the application
  //
  app.start();
}