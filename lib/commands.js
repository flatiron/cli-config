/*
 * commands.js: CLI Commands related to app configuration
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */
 
var config = exports,
    noDelete = ['root', 'remoteUri', 'userconfig', 'auth', 'tmproot', 'tar', 'gzipbin'];

config.usage = [
  '`<app> config *` commands allow you to edit your',
  'local <app> configuration file. Valid commands are:',
  '',
  '<app> config list',
  '<app> config set    <key> <value>',
  '<app> config get    <key>',
  '<app> config delete <key>'
];

//
// ### function set (key, value, callback)
// #### @key {string} Key to set in <app> config.
// #### @value {string} Value to set the key to.
// #### @callback {function} Continuation to pass control to when complete
// Sets the specified `key` in <app> config to `value`.
//
config.set = function (key, value, callback) {
  var args = Array.prototype.slice.call(arguments);
  callback = args.pop();
  
  if (args.length !== 2) {
    config.app.log.error('You must pass both <key> and <value>');
    return callback(true, true);
  }
  
  config.app.set(key, value)
  config.app.save(callback);
};

//
// Usage for `<app> config set <key> <value>`
//
config.set.usage = [
  'Sets the specified <key> <value> pair in the jitsu configuration',
  '',
  '<app> config set <key> <value>'
];

//
// ### function get (key, callback)
// #### @key {string} Key to get in jitsu config.
// #### @callback {function} Continuation to pass control to when complete
// Gets the specified `key` in jitsu config.
//
config.get = function (key, callback) {
  if (!callback) {
    callback = key;
    config.app.log.error('No configuration for ' + 'undefined'.yellow);
    return callback(new Error(), true, true);
  }
  
  var value = config.app.get(key);
  if (!value) {
    config.app.log.error('No configuration value for ' + key.yellow);
    return callback(new Error(), true, true);
  }
  else if (typeof value === 'object') {
    config.app.log.data(key.yellow);
    jitsu.log.putObject(value);
    return callback();
  }
    
  config.app.log.data([key.yellow, value.magenta].join(' '));
  callback();
};

//
// Usage for `jitsu config get <key>`
//
config.get.usage = [
  'Gets the value for the specified <key>',
  'in the jitsu configuration',
  '',
  '<app> config get <key>'
];

//
// ### function delete (key, callback)
// #### @key {string} Key to delete, in <app> config.
// #### @callback {function} Continuation to pass control to when complete
// Deletes the specified `key` in jitsu config.
//
config.delete = function (key, callback) {
  if (!callback) {
    callback = key;
    config.app.log.warn('No configuration for ' + 'undefined'.magenta);
    return callback();
  }

  var value = config.app.get(key);
  if (!value) {
    config.app.log.warn('No configuration value for ' + key.yellow);
    return callback();
  }
  else if (noDelete.indexOf(key) !== -1) {
    config.app.log.warn('Cannot delete reserved setting ' + key.yellow);
    config.app.log.help('Use jitsu config set <key> <value>');
    return callback();
  }
  
  config.app.clear(key);
  config.app.save(callback);
};

//
// Usage for `jitsu config delete <key>`
//
config.delete.usage = [
  'Deletes the specified <key> in the <app> configuration',
  '',
  '<app> config delete <key>'
];

//
// ### function list (callback)
// #### @callback {function} Continuation to pass control to when complete
// Lists all the key-value pairs in jitsu config.
//
config.list = function (callback) {
  var username = config.app.get('username'),
      configFile = config.app.store.file;
  
  var display = [
    ' here is your ' + configFile.grey + ' file:',
    'If you\'d like to change a property try:',
    '<app> config set <key> <value>',
  ];

  if (!username) {
    config.app.log.warn('No user has been setup on this machine');
    display[0] = 'Hello' + display[0];
  }
  else {
    display[0] = 'Hello ' + username.green + display[0];
  }
  
  display.forEach(function (line) {
    config.app.log.help(line);
  });
  
  jitsu.log.putObject(config.app.store.store, {
    password: function (line) {
      var password = line.match(/password.*\:\s(.*)$/)[1];
      return line.replace(password, "'********'");
    }
  }, 2);
  
  callback();
};

//
// Usage for `jitsu config list`
//
config.list.usage = [
  'Lists all configuration values currently',
  'set in the .jitsuconf file',
  '',
  '<app> config list'
];