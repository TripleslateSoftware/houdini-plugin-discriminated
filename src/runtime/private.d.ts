import type { Readable } from 'svelte/store';

export type IncomingState<Data = any> = {
  data: Data | null;
  errors:
    | {
        message: string;
      }[]
    | null;
  fetching: boolean;
};

export interface StatedStore<State extends IncomingState> extends Readable<State> {}

export interface DataState<T> {
  data: T;
  fetching: false;
  errors?: never;
}
export interface FetchingState {
  data?: never;
  fetching: true;
  errors?: never;
}
export interface ErrorsState {
  data?: never;
  errors: NonNullable<IncomingState['errors']>;
  fetching: false;
}

export type StoreValue<Store> =
  Store extends Readable<infer State> ? (State extends IncomingState ? State : never) : never;
export type StoreData<Store> =
  Store extends Readable<infer State>
    ? State extends IncomingState<infer Data>
      ? Data
      : never
    : never;

/**
 * Callback to inform of a value updates.
 *
 * @throws {string | string[]}
 * */
export type Subscriber<T, Transformed> = (value: T) => Promise<Transformed> | Transformed;
