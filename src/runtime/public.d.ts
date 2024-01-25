import type { DataState, FetchingState, ErrorsState } from "./private.js";

export type DiscriminatedState<T> = DataState<T> | FetchingState | ErrorsState;

export * from "./index.js";
