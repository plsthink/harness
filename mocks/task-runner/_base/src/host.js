'use strict';

// Plugin host — validates plugin shape, runs the plugin handler against a
// task input, and turns plugin outcomes into a uniform result envelope.
//
// A plugin is: { name: string, run(input, ctx) -> any | Promise<any> }.
// Anything else throws at validate-time so a malformed plugin fails loudly
// at registration, not silently at dispatch.
//
// The result envelope is always { ok: boolean, value?, error? } — callers
// branch on `ok`, never on thrown errors leaking out of plugin code.

function validatePlugin(plugin) {
  if (!plugin || typeof plugin !== 'object') {
    throw new Error('host.validate: plugin must be an object');
  }
  if (typeof plugin.name !== 'string' || plugin.name === '') {
    throw new Error('host.validate: plugin.name must be a non-empty string');
  }
  if (typeof plugin.run !== 'function') {
    throw new Error('host.validate: plugin.run must be a function');
  }
}

function createHost(opts) {
  const options = opts || {};
  const services = options.services || {};
  const log = typeof options.log === 'function' ? options.log : () => {};

  async function dispatch(plugin, input) {
    const ctx = { services, log };
    try {
      validatePlugin(plugin);
      const value = await plugin.run(input, ctx);
      return { ok: true, value };
    } catch (err) {
      const label = (plugin && plugin.name) || '<invalid>';
      log('host: plugin "' + label + '" threw: ' + err.message);
      return { ok: false, error: err.message };
    }
  }

  return { dispatch, validatePlugin };
}

module.exports = { createHost, validatePlugin };
