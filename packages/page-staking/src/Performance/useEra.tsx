// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import useErasStartSessionIndexLookup from '@polkadot/app-staking/Performance/useErasStartSessionIndexLookup';
import { createNamedHook } from '@polkadot/react-hooks';

function useEraImpl (inputSession?: number) {
  const erasStartSessionIndexLookup = useErasStartSessionIndexLookup();

  function calculateEra (session: number, eraToFirstSessionLookup: [number, number][]) {
    for (let i = 0; i < eraToFirstSessionLookup.length; i++) {
      const eraIndex = eraToFirstSessionLookup[i][0];
      const currentEraSessionStart = eraToFirstSessionLookup[i][1];
      const currentEraSessionEnd = i + 1 < eraToFirstSessionLookup.length ? eraToFirstSessionLookup[i + 1][1] - 1 : undefined;

      if (currentEraSessionStart <= session && currentEraSessionEnd && session <= currentEraSessionEnd) {
        return eraIndex;
      }
    }

    const lastErasStartSessionIndexLookup = eraToFirstSessionLookup.length - 1;

    return eraToFirstSessionLookup[lastErasStartSessionIndexLookup][0];
  }

  const era = useMemo((): number | undefined => {
    if (inputSession && erasStartSessionIndexLookup.length > 0) {
      return calculateEra(inputSession, erasStartSessionIndexLookup);
    }

    return undefined;
  }, [inputSession, erasStartSessionIndexLookup]);

  return era;
}

export default createNamedHook('useEra', useEraImpl);
