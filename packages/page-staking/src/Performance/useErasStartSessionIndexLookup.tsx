// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { EraIndex } from '@polkadot/types/interfaces';
import { Option, u32 } from '@polkadot/types-codec';

type SessionIndexEntry = [{ args: [EraIndex] }, Option<u32>];

function useErasStartSessionIndexLookupImpl () {
  const { api } = useApi();

  const erasStartSessionIndex = useCall<SessionIndexEntry[]>(api.query.staking.erasStartSessionIndex.entries);

  const erasStartSessionIndexLookup = useMemo((): [number, number][] => {
    const result: [number, number][] = [];

    if (erasStartSessionIndex) {
      erasStartSessionIndex.filter(([, values]) => values.isSome)
        .forEach(([key, values]) => {
          const eraIndex = key.args[0];

          result.push([eraIndex.toNumber(), values.unwrap().toNumber()]);
        });
      result.sort(([eraIndexA], [eraIndexB]) => {
        return eraIndexA - eraIndexB;
      });
    }

    return result;
  },
  [erasStartSessionIndex]
  );

  return erasStartSessionIndexLookup;
}

export default createNamedHook('useErasStartSessionIndexLookup', useErasStartSessionIndexLookupImpl);
