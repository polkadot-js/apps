// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { DefinitionCallNamed } from '@polkadot/types/types';

import { useMemo } from 'react';

import { createNamedHook, useApi } from '@polkadot/react-hooks';

function getAllCalls (api: ApiPromise): [Record<string, Record<string, DefinitionCallNamed>>, DefinitionCallNamed | null] {
  const result: Record<string, Record<string, DefinitionCallNamed>> = {};
  let defValue: DefinitionCallNamed | null = null;
  const sections = Object.entries(api.call).sort(([a], [b]) => a.localeCompare(b));

  for (let i = 0; i < sections.length; i++) {
    const [section, methodsObj] = sections[i];
    const methods = Object.entries(methodsObj).sort(([a], [b]) => a.localeCompare(b));

    for (let j = 0; j < methods.length; j++) {
      const [method, { meta }] = methods[j] as unknown as [string, { meta: DefinitionCallNamed }];

      if (meta) {
        if (!result[section]) {
          result[section] = {};

          if (defValue === null) {
            defValue = meta;
          }
        }

        result[section][method] = meta;
      }
    }
  }

  return [result, defValue];
}

function useRuntimeImpl (): [Record<string, Record<string, DefinitionCallNamed>>, DefinitionCallNamed | null] {
  const { api } = useApi();

  return useMemo(
    () => getAllCalls(api),
    [api]
  );
}

export default createNamedHook('useRuntime', useRuntimeImpl);
