'use strict';

// Shallow plugin loader.
//
// Exposes every step of the load pipeline as its own public method, so callers
// have to know about the require mechanism, the path layout, the registration
// map, and the cache. There is no narrow `getPlugin(name)` abstraction — each
// caller reassembles the same dispatch logic by hand.

const fs = require('fs');
const path = require('path');

function createLoader(opts) {
  const options = opts || {};
  const pluginsDir = options.pluginsDir || null;
  const registered = {};
  const cache = {};

  function register(name, plugin) {
    registered[name] = plugin;
  }

  function isRegistered(name) {
    return Object.prototype.hasOwnProperty.call(registered, name);
  }

  function getRegistered(name) {
    return registered[name];
  }

  function pluginPath(name) {
    if (pluginsDir === null) return null;
    return path.join(pluginsDir, name + '.js');
  }

  function pluginFileExists(name) {
    const p = pluginPath(name);
    return p !== null && fs.existsSync(p);
  }

  function requirePlugin(name) {
    const p = pluginPath(name);
    if (p === null) throw new Error('no pluginsDir configured');
    // eslint-disable-next-line global-require
    const mod = require(p);
    return mod && (mod.default || mod);
  }

  function hasCached(name) {
    return Object.prototype.hasOwnProperty.call(cache, name);
  }

  function getCached(name) {
    return cache[name];
  }

  function setCached(name, plugin) {
    cache[name] = plugin;
  }

  function list() {
    return Object.keys(registered).sort();
  }

  // No narrow getPlugin(name). Callers must:
  //   1. check isRegistered(name) -> if yes, getRegistered(name)
  //   2. otherwise check pluginFileExists(name) -> requirePlugin(name)
  //   3. handle the throw, decide to cache, etc.
  // The wide surface IS the contract.

  return {
    register,
    isRegistered,
    getRegistered,
    pluginPath,
    pluginFileExists,
    requirePlugin,
    hasCached,
    getCached,
    setCached,
    list,
  };
}

module.exports = { createLoader };
