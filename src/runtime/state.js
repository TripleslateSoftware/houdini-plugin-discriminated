import { derived, get, writable } from "svelte/store";

/**
 * @template {import('./private.js').BaseStore<any>} Store
 * @template Transformed
 * @template Rest
 *
 * @param {Store} statedStore
 * @param {import('./private.js').Subscriber<import('./private.js').StoreData<Store>, Transformed>} subscriber
 * @param {import('./private.js').Subscriber<import('./private.js').StoreValue<Store>, Rest>=} rest
 * @returns {import('svelte/store').Readable<import('./public.js').DiscriminatedState<Transformed> & Rest>}
 */
export function discriminatedState(statedStore, subscriber, rest) {
  /**
   * @type {import('svelte/store').Writable<import('./public.js').DiscriminatedState<Transformed>>}
   */
  const store = writable({
    fetching: true,
    errors: undefined,
    data: undefined,
  });

  const stateStoreSubscriber = async (
    /** @type {import("./private.js").StoreValue<Store>} */ $statedStore
  ) => {
    if ($statedStore.fetching) {
      // console.log($statedStore);
      store.set({
        ...(rest?.($statedStore) ?? {}),
        fetching: true,
        data: undefined,
        errors: undefined,
      });
    } else if ($statedStore.errors) {
      store.set({
        ...(rest?.($statedStore) ?? {}),
        fetching: false,
        errors: $statedStore.errors,
        data: undefined,
      });
    } else if (!$statedStore.data) {
      store.set({
        ...(rest?.($statedStore) ?? {}),
        fetching: false,
        errors: makeErrors(["Could not retrieve data."]),
        data: undefined,
      });
    } else {
      try {
        const data = await subscriber($statedStore.data);
        store.set({
          ...(rest?.($statedStore) ?? {}),
          fetching: false,
          errors: undefined,
          data,
        });
      } catch (/** @type {any} */ errors) {
        store.set({
          ...(rest?.($statedStore) ?? {}),
          fetching: false,
          errors: makeErrors(typeof errors === "string" ? [errors] : errors),
          data: undefined,
        });
      }
    }
  };

  const makeErrors = (/** @type {string[]} */ messages) =>
    messages.map((message) => ({ message: message }));

  statedStore.subscribe(stateStoreSubscriber);

  return {
    subscribe: store.subscribe,
  };
}
