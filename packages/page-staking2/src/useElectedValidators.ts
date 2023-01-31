// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey, u32 } from '@polkadot/types';
import type { AccountId32 } from '@polkadot/types/interfaces';
import type { SessionInfo } from './types';

import { useEffect, useMemo } from 'react';

import { createNamedHook, useApi, useMapKeys } from '@polkadot/react-hooks';

interface Cache {
  currentEra: SessionInfo['currentEra'];
  elected?: string[];
}

const OPT_ELECTED = {
  transform: (keys: StorageKey<[u32, AccountId32]>[]): string[] =>
    keys.map(({ args: [, stashId] }) =>
      stashId.toString()
    )
};

// since this would only change once per era for the full runtime,
// we just store it globally to not have expensive map-key lookups
const cached: Cache = {
  currentEra: null
};

function useElectedValidatorsImpl ({ currentEra }: SessionInfo): string[] | undefined {
  const { api } = useApi();

  const electedParams = useMemo(
    () => currentEra && (!cached.currentEra || !cached.currentEra.eq(currentEra))
      ? [currentEra]
      : null,
    [currentEra]
  );

  const elected = useMapKeys(electedParams && api.query.staking.erasStakers, electedParams, OPT_ELECTED);

  useEffect((): void => {
    if (currentEra && elected) {
      cached.currentEra = currentEra;
      cached.elected = elected;
    }
  }, [currentEra, elected]);

  return elected || (
    currentEra &&
    cached.currentEra &&
    cached.currentEra.eq(currentEra) &&
    cached.elected
  ) || undefined;
}

export default createNamedHook('useElectedValidators', useElectedValidatorsImpl);
