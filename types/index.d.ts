declare module 'houdini-plugin-discriminated' {
  export function pluginHooks(): Promise<import('houdini').PluginHooks>;
  const _default: import('houdini').PluginInit;
  export default _default;
}

declare module 'houdini-plugin-discriminated/runtime' {
  import type { Readable } from 'svelte/store';
  import type { DocumentArtifact, GraphQLObject, GraphQLVariables } from 'houdini';
  export type DiscriminatedState<T> = DataState<T> | FetchingState | ErrorsState;
  export type Discriminated<T, Rest> = Readable<DiscriminatedState<T> & Rest>;
  type IncomingState<Data = any> = {
    data: Data | null;
    errors:
      | {
          message: string;
        }[]
      | null;
    fetching: boolean;
  };

  interface StatedStore<State extends IncomingState> extends Readable<State> {}

  interface DataState<T> {
    data: T;
    fetching: false;
    errors?: never;
  }
  interface FetchingState {
    data?: never;
    fetching: true;
    errors?: never;
  }
  interface ErrorsState {
    data?: never;
    errors: NonNullable<IncomingState['errors']>;
    fetching: false;
  }

  type StoreValue<Store> =
    Store extends Readable<infer State> ? (State extends IncomingState ? State : never) : never;
  type StoreData<Store> =
    Store extends Readable<infer State>
      ? State extends IncomingState<infer Data>
        ? Data
        : never
      : never;

  /**
   * Callback to inform of a value updates.
   *
   * */
  type Subscriber<T, Transformed> = (value: T) => Promise<Transformed> | Transformed;
  /// <reference types="svelte" />

  export function discriminated<Store extends BaseStore<any, any, any>, Transformed>(
    statedStore: Store,
    subscriber: Subscriber<StoreData<Store>, Transformed>
  ): import('svelte/store').Readable<
    DiscriminatedState<Transformed> & Omit<StoreValue<Store>, 'data' | 'errors' | 'fetching'>
  >;
  export function discriminatedBase<Store extends StatedStore<any>, Transformed, Rest>(
    statedStore: Store,
    subscriber: Subscriber<StoreData<Store>, Transformed>,
    restSubscriber?: Subscriber<StoreValue<Store>, Rest> | undefined
  ): Discriminated<Transformed, Rest>;
  interface BaseStore<
    _Data extends GraphQLObject,
    _Input extends GraphQLVariables,
    _Artifact extends DocumentArtifact = DocumentArtifact
  > {
    subscribe(...args: Parameters<Readable<QueryResult<_Data, _Input>>['subscribe']>): () => void;
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
