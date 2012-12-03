/*jslint sloppy: true, node: true, indent: 2*/

var Memcached = require('memcached');

var Lock = function (locations, options, namespace) {

  this.memcached = new Memcached(locations, options);
  this.namespace = namespace;
  this.locked    = 'LOCKED';
};

Lock.prototype.internal_key = function (key) {

  return (key + (this.namespace || ''));
};

Lock.prototype.is_locked = function (key, callback) {

  this.memcached.get(this.internal_key(key), function (error, result) {

    if (error) {
      return callback(new Error('GET request to Memcached server failed.'), null);
    }
    callback(null, result === this.locked);
  });
};

Lock.prototype.acquire = function (key, expires, retries, callback) {

  callback(new Error('`acquire` is not supoorted by this library.'), null);
};

Lock.prototype.try_acquire = function (key, expires, callback) {

  this.memcached.add(this.internal_key(key), this.locked, expires, function (error, result) {

    if (error) {
      return callback(new Error('ADD request to Memcached server failed.'), null);
    }
    callback(null, result);
  });
};

Lock.prototype.release = function (key, callback) {

  this.memcached.delete(this.internal_key(key), function (error, result) {

    if (error) {
      return callback(new Error('DELETE request to Memcached server failed.'), null);
    }
    callback(null, result);
  });
};

module.exports = Lock;
