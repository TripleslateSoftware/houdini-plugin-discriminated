# houdini-plugin-discriminated

adds a store to be used with a houdini query that can be only one of fetching, errors, or data

## usage

### install

```sh
pnpm add -D houdini-plugin-discriminated
```

### add to houdini config

```js
const config = {
  plugins: {
    'houdini-svelte': {},
    'houdini-plugin-discriminated': {},
    ...
  },
  ...
};
```

### use in load function

```ts
import { load_OrganizationSeasons, discriminated } from '$houdini';

import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
  const { Query } = await load_Query({
    event
  });

  const query = discriminated(Query, (data) => {
    if (!data) throw 'Could not find query';

    return data;
  });

  return {
    query
  };
};
```
