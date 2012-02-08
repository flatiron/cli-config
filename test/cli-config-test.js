
var assert = require('assert'),
    vows = require('vows');
    
vows.describe('cli-config').addBatch({
  "When a flatiron plugin uses `cli-config`": {
    topic: require('./fixtures/app'),
    "should correctly extend the object": function (app) {
      assert.isObject(app.commands);
      assert.isObject(app.commands.config);
      ['set', 'get', 'delete', 'list'].forEach(function (cmd) {
        assert.isFunction(app.commands.config[cmd]);
        assert.isArray(app.commands.config[cmd].usage);
      })
    }
  }
}).export(module);