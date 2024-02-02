import { discriminatedBase, discriminatedBaseAsync } from './base.js';

/**
 * @template {import('../houdini-svelte/index.js').BaseStore<any, any, any>} Store
 * @template Transformed
 *
 * @param {Store} statedStore
 * @param {import('./private').Subscriber<import('./private').StoreData<Store>, Transformed>} subscriber
 * @returns {import('./public.js').Discriminated<Transformed, Omit<import('./private.js').StoreValue<Store>, keyof import('./public.js').DiscriminatedState<Transformed>>>}
 */
export function discriminated(statedStore, subscriber) {
  return discriminatedBase(statedStore, subscriber, ($statedStore) => ({
    ...$statedStore
  }));
}

/**
 * @template {import('../houdini-svelte/index.js').BaseStore<any, any, any>} Store
 * @template Transformed
 *
 * @param {Promise<Store>} statedStore
 * @param {import('./private').Subscriber<import('./private').StoreData<Store>, Transformed>} subscriber
 * @returns {Promise<import('./public.js').Discriminated<Transformed, Omit<import('./private.js').StoreValue<Store>, keyof import('./public.js').DiscriminatedState<Transformed>>>>}
 */
export async function discriminatedAsync(statedStore, subscriber) {
  return discriminatedBaseAsync(statedStore, subscriber, ($statedStore) => ({
    ...$statedStore
  }));
}
