import type { BaseStore } from '../houdini-svelte/index.js';

import type { Discriminated, DiscriminatedState } from './public.js';
import type { StoreValue, StoreData, Subscriber } from './private.js';

export * from './public.js';

export function discriminated<Store extends BaseStore<any, any, any>, Transformed>(
  statedStore: Store,
  subscriber: Subscriber<StoreData<Store>, Transformed>
): Discriminated<Transformed, Omit<StoreValue<Store>, keyof DiscriminatedState<Transformed>>>;

export function discriminatedAsync<Store extends BaseStore<any, any, any>, Transformed>(
  statedStore: Promise<Store>,
  subscriber: Subscriber<StoreData<Store>, Transformed>
): Promise<
  Discriminated<Transformed, Omit<StoreValue<Store>, keyof DiscriminatedState<Transformed>>>
>;
