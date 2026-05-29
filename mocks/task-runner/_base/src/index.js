'use strict';

// Public API — createRunner wires the loader and host together and exposes
// the surface callers depend on: run(taskType, input), register(name, plugin).
//
// Callers never touch the loader or host directly; the runner is the only
// public seam. This keeps the plugin-discovery and plugin-host evolution
// independent of consuming code.

const { createLoader } = require('./loader.js');
const { createHost } = require('./host.js');

function createRunner(opts) {
  const options = opts || {};
  const log = typeof options.log === 'function' ? options.log : () => {};
  const loader = createLoader({ pluginsDir: options.pluginsDir || null, log });
  const host = createHost({ services: options.services || {}, log });

  function register(name, plugin) {
    loader.register(name, plugin);
  }

  async function run(taskType, input) {
    const plugin = loader.getPlugin(taskType);
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
