// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { EraIndex } from '@polkadot/types/interfaces';
import { Option, u32 } from '@polkadot/types-codec';

type SessionIndexEntry = [{ args: [EraIndex] }, Option<u32>];

function useEraImpl (inputSession?: number) {
  const { api } = useApi();
  const erasStartSessionIndex = useCall<SessionIndexEntry[]>(api.query.staking.erasStartSessionIndex.entries);

  function calculateEra (session: number, erasStartSessionIndex: SessionIndexEntry[]) {
    const erasStartSessionIndexLookup: [number, number][] = [];

    erasStartSessionIndex.filter(([, values]) => values.isSome)
      .forEach(([key, values]) => {
        const eraIndex = key.args[0];

        erasStartSessionIndexLookup.push([eraIndex.toNumber(), values.unwrap().toNumber()]);
      });
    erasStartSessionIndexLookup.sort(([eraIndexA], [eraIndexB]) => {
      return eraIndexA - eraIndexB;
    });

    for (let i = 0; i < erasStartSessionIndexLookup.length; i++) {
      const eraIndex = erasStartSessionIndexLookup[i][0];
      const currentEraSessionStart = erasStartSessionIndexLookup[i][1];
      const currentEraSessionEnd = i + 1 < erasStartSessionIndexLookup.length ? erasStartSessionIndexLookup[i + 1][1] - 1 : undefined;

      if (currentEraSessionStart <= session && currentEraSessionEnd && session <= currentEraSessionEnd) {
        return eraIndex;
      }
    }

    const lastErasStartSessionIndexLookup = erasStartSessionIndexLookup.length - 1;

    return erasStartSessionIndexLookup[lastErasStartSessionIndexLookup][0];
  }

  const era = useMemo((): number | undefined => {
    if (inputSession && erasStartSessionIndex) {
      return calculateEra(inputSession, erasStartSessionIndex);
    }

    return undefined;
  }, [inputSession, erasStartSessionIndex]);

  return era;
}

export default createNamedHook('useEra', useEraImpl);
