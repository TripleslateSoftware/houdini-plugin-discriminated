import { writable } from 'svelte/store';

/**
 * @template {import("./private").StatedStore<any>} Store
 * @template Transformed
 * @template Rest
 *
 * @param {Store} statedStore
 * @param {import('./private.js').Subscriber<import('./private').StoreData<Store>, Transformed>} subscriber
 * @param {import('./private.js').Subscriber<import('./private').StoreValue<Store>, Rest>=} rest
 * @returns {import('svelte/store').Readable<import('./public.js').DiscriminatedState<Transformed> & Rest>}
 */
export function discriminatedState(statedStore, subscriber, rest) {
  /**
   * @type {import('svelte/store').Writable<import('./public.js').DiscriminatedState<Transformed>>}
   */
  const store = writable({
    fetching: true,
    errors: undefined,
    data: undefined
  });

  const makeErrors = (/** @type {string[]} */ messages) =>
    messages.map((message) => ({ message: message }));

  /** @type {import('svelte/store').Subscriber<import('./private').StoreValue<Store>>} */
  const statedStoreSubscriber = async ($statedStore) => {
    if ($statedStore.fetching) {
      // console.log($statedStore);
      store.set({
        ...((await rest?.($statedStore)) ?? {}),
        fetching: true,
        data: undefined,
        errors: undefined
      });
    } else if ($statedStore.errors) {
      store.set({
        ...((await rest?.($statedStore)) ?? {}),
        fetching: false,
        errors: $statedStore.errors,
        data: undefined
      });
    } else if (!$statedStore.data) {
      store.set({
        ...((await rest?.($statedStore)) ?? {}),
        fetching: false,
        errors: makeErrors(['Could not retrieve data.']),
        data: undefined
      });
    } else {
      try {
        const data = await subscriber($statedStore.data);
        store.set({
          ...((await rest?.($statedStore)) ?? {}),
          fetching: false,
          errors: undefined,
          data
        });
      } catch (/** @type {any} */ errors) {
        store.set({
          ...((await rest?.($statedStore)) ?? {}),
          fetching: false,
          errors: makeErrors(typeof errors === 'string' ? [errors] : errors),
          data: undefined
        });
      }
    }
  };

  statedStore.subscribe(statedStoreSubscriber);

  return {
    subscribe: store.subscribe
  };
}
