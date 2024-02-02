import { get, writable } from 'svelte/store';

/**
 * @template {import("./private").StatedStore<any>} Store
 * @template Transformed
 * @template Rest
 *
 * @param {Store} statedStore
 * @param {import('./private.js').Subscriber<import('./private').StoreData<Store>, Transformed>} dataSubscriber
 * @param {import('./private.js').Subscriber<import('./private').StoreValue<Store>, Rest>=} restSubscriber
 * @returns {import('./public.js').Discriminated<Transformed, Rest>}
 */
export function discriminatedBase(statedStore, dataSubscriber, restSubscriber) {
  /**
   * @type {import('svelte/store').Writable<import('./public.js').DiscriminatedState<Transformed> & Rest>}
   */
  const store = writable({
    ...restSubscriber?.(get(statedStore)),
    fetching: true,
    errors: undefined,
    data: undefined
  });

  const makeErrors = (/** @type {string[]} */ messages) =>
    messages.map((message) => ({ message: message }));

  /** @type {import('svelte/store').Subscriber<import('./private').StoreValue<Store>>} */
  const statedStoreSubscriber = async ($statedStore) => {
    const rest = await restSubscriber?.($statedStore);
    if ($statedStore.fetching) {
      /** @type {import('./private').FetchingState} */
      const state = {
        ...rest,
        fetching: true,
        data: undefined,
        errors: undefined
      };
      store.set(state);
    } else if ($statedStore.errors) {
      /** @type {import('./private').ErrorsState} */
      const state = {
        ...rest,
        fetching: false,
        errors: $statedStore.errors,
        data: undefined
      };
      store.set(state);
    } else if (!$statedStore.data) {
      /** @type {import('./private').ErrorsState} */
      const state = {
        ...rest,
        fetching: false,
        errors: makeErrors(['Could not retrieve data.']),
        data: undefined
      };
      store.set(state);
    } else {
      try {
        const data = await dataSubscriber($statedStore.data);

        /** @type {import('./private').DataState<Transformed>} */
        const state = {
          ...rest,
          fetching: false,
          errors: undefined,
          data
        };
        store.set(state);
      } catch (/** @type {any} */ errors) {
        /** @type {import('./private').ErrorsState} */
        const state = {
          ...rest,
          fetching: false,
          errors: makeErrors(typeof errors === 'string' ? [errors] : errors),
          data: undefined
        };
        store.set(state);
      }
    }
  };

  statedStore.subscribe(statedStoreSubscriber);

  return {
    subscribe: store.subscribe
  };
}

/**
 * @template {import("./private").StatedStore<any>} Store
 * @template Transformed
 * @template Rest
 *
 * @param {Promise<Store>} statedStore
 * @param {import('./private.js').Subscriber<import('./private').StoreData<Store>, Transformed>} dataSubscriber
 * @param {import('./private.js').Subscriber<import('./private').StoreValue<Store>, Rest>=} restSubscriber
 * @returns {Promise<import('./public.js').Discriminated<Transformed, Rest>>}
 */
export async function discriminatedBaseAsync(statedStore, dataSubscriber, restSubscriber) {
  return discriminatedBase(await statedStore, dataSubscriber, restSubscriber);
}
