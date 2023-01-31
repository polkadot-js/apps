// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { SessionInfo, Validator } from './types';

import { useEffect, useMemo } from 'react';

import { createNamedHook } from '@polkadot/react-hooks';

import useValidatorsAll from './useValidatorsAll';

interface Cache {
  activeEra: BN;
  tagged: Validator[];
}

function excludeValidators (from: Validator[], exclude: Validator[]): Validator[] {
  return from.filter(({ stashId }) =>
    !exclude.some((v) => v.stashId === stashId)
  );
}

let cache: Cache | undefined;

function useValidatorsWaitingImpl (favorites: string[], sessionInfo: SessionInfo, activeValidators?: Validator[]): Validator[] | undefined {
  const allValidators = useValidatorsAll(favorites, sessionInfo);

  // both active and all is already sorted and tagged, so we don't
  // need to re-sort the waiting list
  const tagged = useMemo(
    () => allValidators && activeValidators && excludeValidators(allValidators, activeValidators),
    [activeValidators, allValidators]
  );

  useEffect((): void => {
    if (tagged && sessionInfo.activeEra) {
      cache = { activeEra: sessionInfo.activeEra, tagged };
    }
  }, [sessionInfo, tagged]);

  return tagged || (
    cache &&
    sessionInfo.activeEra?.eq(cache.activeEra) &&
    cache.tagged
  ) || undefined;
}

export default createNamedHook('useValidatorsWaiting', useValidatorsWaitingImpl);
