'use strict';

// Plugin loader — narrow interface, hides the discovery + require mechanism.
// Public surface: createLoader({ pluginsDir }) -> { getPlugin(name) }.
// Callers never see filesystem paths, never call require themselves, and never
// distinguish "not registered" from "load error" — getPlugin returns the
// plugin object or null. A name that resolves but fails to load is treated as
// not-loadable and reported through the same null channel after a single
// internal warning to host.log; the deep-module bet is that callers do not
// need to branch on the reason.

const fs = require('fs');
const path = require('path');

function createLoader(opts) {
  const options = opts || {};
  const pluginsDir = options.pluginsDir || null;
  const registered = new Map();
  const cache = new Map();
  const log = typeof options.log === 'function' ? options.log : () => {};

  function register(name, plugin) {
    if (typeof name !== 'string' || name === '') {
      throw new Error('loader.register: name must be a non-empty string');
    }
    registered.set(name, plugin);
    cache.delete(name);
  }

  function loadFromDir(name) {
    if (pluginsDir === null) return null;
    const candidate = path.join(pluginsDir, name + '.js');
    if (!fs.existsSync(candidate)) return null;
    try {
      // require resolution is internal — callers see only the returned object.
      // eslint-disable-next-line global-require
      const mod = require(candidate);
      return mod && (mod.default || mod);
    } catch (err) {
      log('loader: failed to load plugin "' + name + '": ' + err.message);
      return null;
    }
  }

  function getPlugin(name) {
    if (cache.has(name)) return cache.get(name);
    let plugin = registered.has(name) ? registered.get(name) : loadFromDir(name);
    if (!plugin) plugin = null;
    cache.set(name, plugin);
    return plugin;
  }

  function list() {
    // Names known via registration; directory-resident plugins are discovered
    // lazily on getPlugin(name) — list() is a best-effort affordance, not the
    // primary contract. Deep loaders prefer callers ask by name.
    return Array.from(registered.keys()).sort();
  }

  return { register, getPlugin, list };
}

module.exports = { createLoader };
