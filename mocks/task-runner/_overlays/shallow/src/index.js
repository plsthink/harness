'use strict';

// Public API — wires loader + host together. Note the leakage from the
// shallow loader: this module has to know about the registration map,
// the directory-existence check, the require call, and the cache. Each of
// those is a separate call against the loader's wide surface. The narrow
// "give me a plugin by name" abstraction is missing — every caller of the
// loader has to reimplement this same sequence.

const { createLoader } = require('./loader.js');
const { createHost } = require('./host.js');

function createRunner(opts) {
  const options = opts || {};
  const log = typeof options.log === 'function' ? options.log : () => {};
  const loader = createLoader({ pluginsDir: options.pluginsDir || null, log });
  const host = createHost({ services: options.services || {}, log });

  function register(name, plugin) {
    if (typeof name !== 'string' || name === '') {
      throw new Error('runner.register: name must be a non-empty string');
    }
    loader.register(name, plugin);
  }

  async function resolve(taskType) {
    if (loader.hasCached(taskType)) return loader.getCached(taskType);
    let plugin = null;
    if (loader.isRegistered(taskType)) {
      plugin = loader.getRegistered(taskType);
    } else if (loader.pluginFileExists(taskType)) {
      try {
        plugin = loader.requirePlugin(taskType);
      } catch (err) {
        log('runner: failed to require plugin "' + taskType + '": ' + err.message);
        plugin = null;
      }
    }
    loader.setCached(taskType, plugin);
    return plugin;
  }

  async function run(taskType, input) {
    const plugin = await resolve(taskType);
    if (!plugin) {
      return { ok: false, error: 'no plugin registered for task type: ' + taskType };
    }
    return host.dispatch(plugin, input);
  }

  function list() {
    return loader.list();
  }

  return { register, run, list };
}

module.exports = { createRunner };
