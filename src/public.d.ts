declare module 'houdini' {
  interface HoudiniPluginConfig {
    'houdini-plugin-discriminated': HoudiniPluginDiscriminatedConfig;
  }
}

export type HoudiniPluginDiscriminatedConfig = {};

export * from './index.js';
