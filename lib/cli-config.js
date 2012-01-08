/*
 * cli-config.js: Top-level include for the `cli-config` module. 
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */

var utile = require('utile');

var cliConfig = exports;

cliConfig.commands = require('./commands');
cliConfig.name = 'cli-config';

cliConfig.attach = function (options) {
  if (!this.plugins.cli) {
    throw new Error('`cli` plugin is required to use `cli-config`');
  }
  
  cliConfig.commands.app = this;
  this.commands['config'] = this.commands['config'] || {};
  this.commands['config'] = utile.mixin(this.commands['config'], cliConfig.commands);
};

cliConfig.detach = function () {
  var app = this;
  
  Object.keys(app.commands['config']).forEach(function (method) {
    if (cliConfig.commands[method]) {
      delete app.commands['config'][method];
    }
    
    cliConfig.commands.app = null;
  });
};