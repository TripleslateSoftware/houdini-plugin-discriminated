import { test, describe, expect } from 'vitest';
import { get, writable } from 'svelte/store';

import { discriminatedBase } from '../runtime/base';

describe('discriminatedBase', async () => {
  const data = {
    name: 'hello'
  };
  const errors = [
    {
      message: 'error'
    }
  ];
  const variables = ['test'];

  /**
   * @type {import('svelte/store').Writable<import('../runtime/private').IncomingState<typeof data> & { variables: string[] }>}
   */
  const statedStore = writable({
    data: null,
    fetching: true,
    errors: null,
    variables: []
  });
  const discriminatedStore = discriminatedBase(
    statedStore,
    async (data) => data.name,
    async (value) => ({
      variables: value.variables
    })
  );

  test('fetching state', async () => {
    statedStore.set({
      data: null,
      fetching: true,
      errors: null,
      variables: variables
    });

    const $discriminatedStore = get(await discriminatedStore);
    expect($discriminatedStore.fetching).toBe(true);
    // with undefined data
    expect($discriminatedStore.data).toBe(undefined);
    // with undefined errors
    expect($discriminatedStore.errors).toBe(undefined);
    // with variables
    expect($discriminatedStore.variables).toBe(variables);
  });

  test('errors state', async () => {
    statedStore.set({
      data: null,
      fetching: false,
      errors: errors,
      variables: variables
    });
    const $discriminatedStore = get(await discriminatedStore);
    expect($discriminatedStore.errors).toBe(errors);
    // with false fetching
    expect($discriminatedStore.fetching).toBe(false);
    // with undefined data
    expect($discriminatedStore.data).toBe(undefined);
    // with variables
    expect($discriminatedStore.variables).toBe(variables);
  });

  test(
    'data state',
    async () => {
      // need these phony awaits because subscribers are not yet resolved
      await statedStore.set({
        data,
        fetching: false,
        errors: null,
        variables: variables
      });
      const $discriminatedStore = get(await discriminatedStore);
      expect($discriminatedStore.data).toBe(data.name);
      // with false fetching
      expect($discriminatedStore.fetching).toBe(false);
      // with undefined errors
      expect($discriminatedStore.errors).toBe(undefined);
      // with variables
      expect($discriminatedStore.variables).toBe(variables);
    },
    {}
  );
});

describe('unexpected errors', async () => {
  test('dataSubscriber', async () => {
    const data = {
      name: 'hello'
    };
    const variables = ['test'];

    /**
     * @type {import('svelte/store').Writable<import('../runtime/private').IncomingState<typeof data> & { variables: string[] }>}
     */
    const statedStore = writable({
      data: null,
      fetching: true,
      errors: null,
      variables: []
    });
    const discriminatedStore = discriminatedBase(
      statedStore,
      // @ts-ignore
      async (data) => functionThatDoesntExist(data),
      async (value) => ({
        variables: value.variables
      })
    );

    // need these phony awaits because subscribers are not yet resolved
    await statedStore.set({
      data,
      fetching: false,
      errors: null,
      variables: variables
    });
    const $discriminatedStore = get(await discriminatedStore);
    expect($discriminatedStore.data).toBe(undefined);
    // with false fetching
    expect($discriminatedStore.fetching).toBe(false);
    // with undefined errors
    expect($discriminatedStore.errors).toStrictEqual([
      { message: 'ReferenceError: functionThatDoesntExist is not defined' }
    ]);
    // with variables
    expect($discriminatedStore.variables).toBe(variables);
  });
});
