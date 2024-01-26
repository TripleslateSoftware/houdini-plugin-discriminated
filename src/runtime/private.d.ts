import type { Readable, Writable } from "svelte/store";

export interface IncomingState<Data = any> {
  data: Data | null;
  errors:
    | {
        message: string;
      }[]
    | null;
  fetching: boolean;
}

export interface BaseStore<State extends IncomingState>
  extends Readable<State> {}

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
  errors: NonNullable<IncomingState["errors"]>;
  fetching: false;
}

export type StoreValue<Store> = Store extends Readable<infer T> ? T : never;
export type StoreData<Store> = Store extends BaseStore<infer Data>
  ? Data
  : never;

/**
 * Callback to inform of a value updates.
 *
 * @throws {string | string[]}
 * */
export type Subscriber<Data, Transformed> = (
  data: Data
) => Promise<Transformed> | Transformed;
