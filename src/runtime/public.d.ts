import type { Readable } from 'svelte/store';
import type { DataState, FetchingState, ErrorsState } from './private.js';

export type DiscriminatedState<T> = DataState<T> | FetchingState | ErrorsState;
export type Discriminated<T, Rest> = Readable<DiscriminatedState<T> & Rest>;

export * from './base.js';
