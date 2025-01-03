// Copyright 2017-2025 @polkadot/app-runtime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RawParam } from '@polkadot/react-params/types';
import type { DefinitionCallNamed } from '@polkadot/types/types';
import type { Result } from './types.js';

import React, { useCallback, useState } from 'react';

import { useApi } from '@polkadot/react-hooks';

import Results from './Results.js';
import Selection from './Selection.js';

let id = 0;

function RuntimeApp (): React.ReactElement {
  const { api } = useApi();
  const [results, setResults] = useState<Result[]>([]);

  const addResult = useCallback(
    (result: Result) => setResults((prev) => [result].concat(...prev)),
    []
  );

  const onSubmit = useCallback(
    (def: DefinitionCallNamed, values: RawParam[]): void => {
      api.call[def.section][def.method](...values.map(({ value }) => value))
        .then((result) => addResult({ def, id: ++id, result }))
        .catch((e): void => {
          addResult({ def, error: e as Error, id: ++id });
          console.error(e);
        });
    },
    [api, addResult]
  );

  return (
    <>
      <Selection onSubmit={onSubmit} />
      <Results results={results} />
    </>
  );
}

export default React.memo(RuntimeApp);
