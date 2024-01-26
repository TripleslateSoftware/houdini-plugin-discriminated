import type { Readable, Writable } from "svelte/store";

export type IncomingState<Data = any> = {
  data: Data | null;
  errors:
    | {
        message: string;
      }[]
    | null;
  fetching: boolean;
};

export type BaseStore<Data> = Readable<IncomingState<Data>>;

export type DataState<T> = { data: T; fetching: false; errors?: never };
export type FetchingState = { data?: never; fetching: true; errors?: never };
export type ErrorsState = {
  data?: never;
  errors: NonNullable<IncomingState["errors"]>;
  fetching: false;
};
export type WritableDiscriminatedState<T> = Writable<
  DataState<T> | FetchingState | ErrorsState
>;

export type StoreValue<Store> = Store extends BaseStore<infer State>
  ? State
  : never;
export type StoreData<Store> = Store extends BaseStore<infer State>
  ? State extends IncomingState<infer Data>
    ? Data
    : never
  : never;

/**
 * Callback to inform of a value updates.
 *
 * @throws {string | string[]}
 * */
export type Subscriber<Data, Transformed> = (
  data: Data
) => Promise<Transformed> | Transformed;
