import type { Readable } from 'svelte/store';

import type { BaseStore } from '../houdini-svelte/index.js';

import type { DiscriminatedState } from './public.js';
import type { StoreData, StoreValue, Subscriber } from './private.js';

export * from './public.js';

export function discriminated<Store extends BaseStore<any, any, any>, Transformed>(
  statedStore: Store,
  subscriber: Subscriber<StoreData<Store>, Transformed>
): Readable<
  DiscriminatedState<Transformed> & Omit<StoreValue<Store>, keyof DiscriminatedState<Transformed>>
>;

export function discriminatedAsync<Store extends BaseStore<any, any, any>, Transformed>(
  statedStore: Promise<Store>,
  subscriber: Subscriber<StoreData<Store>, Transformed>
): Promise<
  Readable<
    DiscriminatedState<Transformed> & Omit<StoreValue<Store>, keyof DiscriminatedState<Transformed>>
  >
>;
