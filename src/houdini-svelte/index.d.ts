import type { Readable } from 'svelte/store';

import type { QueryResult } from '../houdini/index.js';

export declare interface BaseStore<_Data, _Input, _Artifact> {
  subscribe(...args: Parameters<Readable<QueryResult<_Data, _Input>>['subscribe']>): () => void;
}
