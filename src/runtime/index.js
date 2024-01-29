import { discriminatedBase } from './base.js';

/**
 * @template {import("../houdini-svelte/index.js").BaseStore<any, any, any>} Store
 * @template Transformed
 *
 * @param {Store} statedStore
 * @param {import("./private").Subscriber<import("./private").StoreData<Store>, Transformed>} subscriber
 * @returns {import("svelte/store").Readable<import("./public.js").DiscriminatedState<Transformed> & Omit<import("./private.js").StoreValue<Store>, keyof import("./public.js").DiscriminatedState<Transformed>>>}
 */
export function discriminated(statedStore, subscriber) {
  return discriminatedBase(statedStore, subscriber, ($statedStore) => ({
    ...$statedStore
  }));
}
