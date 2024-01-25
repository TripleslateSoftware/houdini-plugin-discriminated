import { discriminatedState } from "./state.js";

/**
 * @template {import("../houdini-svelte/index.js").BaseStore<any, any, any>} Store
 * @template Transformed
 *
 * @param {Promise<Store>} statedStorePromise
 * @param {import("./private.js").Subscriber<import("./private.js").StoreData<Store>, Transformed>} subscriber
 * @returns {import("svelte/store").Readable<import("./public.js").DiscriminatedState<Transformed> & Omit<import("./private.js").StoreValue<Store>, keyof import("./public.js").DiscriminatedState<Transformed>>>}
 */
export function discriminated(statedStorePromise, subscriber) {
  return discriminatedState(statedStorePromise, subscriber, ($statedStore) => ({
    ...$statedStore,
  }));
}
