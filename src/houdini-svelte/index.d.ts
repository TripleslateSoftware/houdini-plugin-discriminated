import type { Readable } from 'svelte/store';

import type { QueryResult } from '../houdini/index.js';
import type { DocumentArtifact, GraphQLObject, GraphQLVariables } from 'houdini';

export declare interface BaseStore<
  _Data extends GraphQLObject,
  _Input extends GraphQLVariables,
  _Artifact extends DocumentArtifact = DocumentArtifact
> {
  subscribe(...args: Parameters<Readable<QueryResult<_Data, _Input>>['subscribe']>): () => void;
}
