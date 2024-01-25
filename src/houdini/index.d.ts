export type QueryResult<_Data = any, _Input = any> = {
  data: _Data | null;
  errors:
    | {
        message: string;
      }[]
    | null;
  fetching: boolean;
};
