import { test, describe, expect } from 'vitest';
import { get, writable } from 'svelte/store';

import { discriminatedState } from '../runtime/state';
import type { IncomingState } from '../runtime/private';

describe('discriminatedState', async () => {
  const data = {
    name: 'hello'
  };
  const errors = [
    {
      message: 'error'
    }
  ];
  const variables = ['test'];

  const statedStore = writable<IncomingState<typeof data> & { variables: string[] }>({
    data: null,
    fetching: true,
    errors: null,
    variables: []
  });
  const discriminatedStore = discriminatedState(
    statedStore,
    (data) => data.name,
    (value) => ({
      variables: value.variables
    })
  );

  test('initial state fetching', async function () {
    const $discriminatedStore = get(discriminatedStore);
    expect($discriminatedStore.fetching).toBe(true);
    // with undefined data
    expect($discriminatedStore.data).toBe(undefined);
    // with undefined errors
    expect($discriminatedStore.errors).toBe(undefined);
  });

  test('errors state', async () => {
    statedStore.set({
      data: null,
      fetching: false,
      errors: errors,
      variables: variables
    });
    const $discriminatedStore = get(discriminatedStore);
    expect($discriminatedStore.errors).toBe(errors);
    // with false fetching
    expect($discriminatedStore.fetching).toBe(false);
    // with undefined data
    expect($discriminatedStore.data).toBe(undefined);
    // with variables
    expect($discriminatedStore.variables).toBe(variables);
  });

  test('data state', async () => {
    statedStore.set({
      data,
      fetching: false,
      errors: null,
      variables: variables
    });
    const $discriminatedStore = get(discriminatedStore);
    expect($discriminatedStore.data).toBe(data.name);
    // with false fetching
    expect($discriminatedStore.fetching).toBe(false);
    // with undefined errors
    expect($discriminatedStore.errors).toBe(undefined);
    // with variables
    expect($discriminatedStore.variables).toBe(variables);
  });
});
