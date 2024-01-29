import { plugin } from 'houdini';

/** @returns {Promise<import("houdini").PluginHooks>} */
export const pluginHooks = async () => ({
  order: 'after',
  includeRuntime: './runtime',
  transformRuntime: {
    ['index.js']: ({ content }) => {
      const fixedImports = content.replaceAll(
        '../houdini-svelte/index.js',
        '../../houdini-svelte/runtime/stores/base.js'
      );
      return fixedImports;
    }
  }
});

export default plugin('houdini-plugin-discriminated', async () => {
  return pluginHooks();
});
