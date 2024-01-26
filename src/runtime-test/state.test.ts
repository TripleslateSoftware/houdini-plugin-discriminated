import { test, describe, expect } from "vitest";
import { get, writable } from "svelte/store";

import { discriminatedState } from "../runtime/state";
import type { IncomingState } from "../runtime/private";

describe("discriminatedState", async () => {
  const data = {
    name: "hello",
  };
  const errors = [
    {
      message: "error",
    },
  ];

  const statedStore = writable<IncomingState<typeof data>>({
    data: null,
    fetching: true,
    errors: null,
  });
  const discriminatedStore = discriminatedState(
    statedStore,
    (data) => data.name
  );

  test("initial state fetching", async function () {
    const $discriminatedStore = get(discriminatedStore);
    expect($discriminatedStore.fetching).toBe(true);
    // with undefined data
    expect($discriminatedStore.data).toBe(undefined);
    // with undefined errors
    expect($discriminatedStore.errors).toBe(undefined);
  });

  test("errors state", async () => {
    statedStore.set({
      data: null,
      fetching: false,
      errors: errors,
    });
    const $discriminatedStore = get(discriminatedStore);
    expect($discriminatedStore.errors).toBe(errors);
    // with false fetching
    expect($discriminatedStore.fetching).toBe(false);
    // with undefined data
    expect($discriminatedStore.data).toBe(undefined);
  });

  test("data state", async () => {
    statedStore.set({
      data,
      fetching: false,
      errors: null,
    });
    const $discriminatedStore = get(discriminatedStore);
    expect($discriminatedStore.data).toBe(data.name);
    // with false fetching
    expect($discriminatedStore.fetching).toBe(false);
    // with undefined errors
    expect($discriminatedStore.errors).toBe(undefined);
  });
});
