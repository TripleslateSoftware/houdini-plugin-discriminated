declare module "houdini-plugin-discriminated" {
  const _default: import("houdini").PluginInit;
  export default _default;
}

declare module "houdini-plugin-discriminated/runtime" {
  import type { Readable } from "svelte/store";
  import type {
    DocumentArtifact,
    GraphQLObject,
    GraphQLVariables,
  } from "houdini";
  export type DiscriminatedState<T> =
    | DataState<T>
    | FetchingState
    | ErrorsState;
  type IncomingState<Data = any> = {
    data: Data | null;
    errors:
      | {
          message: string;
        }[]
      | null;
    fetching: boolean;
  };

  type BaseStore_1<T extends IncomingState> = Readable<T>;

  type DataState<T> = { data: T; fetching: false; errors?: never };
  type FetchingState = { data?: never; fetching: true; errors?: never };
  type ErrorsState = {
    data?: never;
    errors: NonNullable<IncomingState["errors"]>;
    fetching: false;
  };

  type StoreValue<T> = T extends BaseStore_1<infer U> ? U : never;
  type StoreData<T> = T extends BaseStore_1<infer U>
    ? U extends IncomingState<infer V>
      ? V
      : never
    : never;

  /**
   * Callback to inform of a value updates.
   *
   * */
  type Subscriber<Data, Transformed> = (
    data: Data
  ) => Promise<Transformed> | Transformed;
  /// <reference types="svelte" />

  export function discriminated<
    Store extends BaseStore<any, any, any>,
    Transformed
  >(
    statedStorePromise: Promise<Store>,
    subscriber: Subscriber<StoreData<Store>, Transformed>
  ): Readable<
    DiscriminatedState<Transformed> &
      Omit<StoreValue<Store>, "data" | "errors" | "fetching">
  >;
  interface BaseStore<
    _Data extends GraphQLObject,
    _Input extends GraphQLVariables,
    _Artifact extends DocumentArtifact = DocumentArtifact
  > {
    subscribe(
      ...args: Parameters<Readable<QueryResult<_Data, _Input>>["subscribe"]>
    ): () => void;
  }
  type QueryResult<_Data = any, _Input = any> = {
    data: _Data | null;
    errors:
      | {
          message: string;
        }[]
      | null;
    fetching: boolean;
  };
}

//# sourceMappingURL=index.d.ts.map
