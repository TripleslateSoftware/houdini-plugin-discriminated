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

export type BaseStore<T extends IncomingState> = Readable<T>;

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

export type StoreValue<T> = T extends BaseStore<infer U> ? U : never;
export type StoreData<T> = T extends BaseStore<infer U>
  ? U extends IncomingState<infer V>
    ? V
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
