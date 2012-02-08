/*
 * cli-config.js: Top-level include for the `cli-config` module. 
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */

var utile = require('flatiron').common;

var cliConfig = exports;

cliConfig.commands = require('./commands');
cliConfig.name = 'cli-config';

cliConfig.attach = function (options) {
  var app = this;
  options = options || {};
  
  if (!app.plugins.cli) {
    throw new Error('`cli` plugin is required to use `cli-config`');
  }
  else if (!app.config) {
    throw new Error('`app.config` must be set to use `cli-config`');
  }
  
  app.config.remove('literal');
  cliConfig.app = app;
  cliConfig.store = options.store || null;
  cliConfig.restricted = options.restricted || [];
  cliConfig.before = options.before || {};
  cliConfig.setUsage();
  
  app.commands['config'] = app.commands['config'] || {};
  app.commands['config'] = utile.mixin(app.commands['config'], cliConfig.commands);
  app.alias('conf', { resource: 'config', command: 'list' });
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

cliConfig.setUsage = function () {
  if (!cliConfig.app.name) {
    return;
  }
  
  function templateUsage(usage) {
    return usage.map(function (line) {
      return line.replace(/\<app\>/ig, cliConfig.app.name);
    });
  }
  
  Object.keys(cliConfig.commands).forEach(function (command) {
    if (command === 'usage') {
      cliConfig.commands.usage = templateUsage(cliConfig.commands.usage)
    }
    else if (cliConfig.commands[command].usage) {
      cliConfig.commands[command].usage = templateUsage(cliConfig.commands[command].usage)
    }
  });
};