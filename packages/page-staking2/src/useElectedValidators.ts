// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey, u32 } from '@polkadot/types';
import type { AccountId32 } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { SessionInfo } from './types';

import { useEffect, useMemo } from 'react';

import { createNamedHook, useApi, useMapKeys } from '@polkadot/react-hooks';

interface Cache {
  currentEra: BN;
  elected: string[];
}

const OPT_ELECTED = {
  transform: (keys: StorageKey<[u32, AccountId32]>[]): string[] =>
    keys.map(({ args: [, stashId] }) =>
      stashId.toString()
    )
};

// since this would only change once per era for the full runtime,
// we just store it globally to not have expensive map-key lookups
let cache: Cache | undefined;

function useElectedValidatorsImpl ({ currentEra }: SessionInfo): string[] | undefined {
  const { api } = useApi();

  const electedParams = useMemo(
    () => cache && currentEra && !cache.currentEra.eq(currentEra)
      ? [currentEra]
      : null,
    [currentEra]
  );

  const elected = useMapKeys(electedParams && api.query.staking.erasStakers, electedParams, OPT_ELECTED);

  useEffect((): void => {
    if (currentEra && elected) {
      cache = { currentEra, elected };
    }
  }, [currentEra, elected]);

  return elected || (
    cache &&
    currentEra?.eq(cache.currentEra) &&
    cache.elected
  ) || undefined;
}

export default createNamedHook('useElectedValidators', useElectedValidatorsImpl);
