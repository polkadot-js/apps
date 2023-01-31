// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { SessionInfo, Validator } from './types';

import { useEffect, useMemo } from 'react';

import { createNamedHook } from '@polkadot/react-hooks';

import useValidatorsAll from './useValidatorsAll';

interface Cache {
  activeEra: BN;
  validators: Validator[];
}

function excludeValidators (from?: Validator[], exclude?: Validator[]): Validator[] | undefined {
  return from && exclude && from.filter(({ stashId }) =>
    !exclude.some((v) => v.stashId === stashId)
  );
}

let cache: Cache | undefined;

function useValidatorsWaitingImpl (favorites: string[], sessionInfo: SessionInfo, activeValidators?: Validator[]): Validator[] | undefined {
  const allValidators = useValidatorsAll(favorites, sessionInfo);

  // both active and all is already sorted and tagged, so we don't
  // need to re-sort the waiting list
  const validators = useMemo(
    () => excludeValidators(allValidators, activeValidators),
    [activeValidators, allValidators]
  );

  useEffect((): void => {
    if (validators && sessionInfo.activeEra) {
      cache = { activeEra: sessionInfo.activeEra, validators };
    }
  }, [sessionInfo, validators]);

  return validators || (
    cache &&
    sessionInfo.activeEra?.eq(cache.activeEra) &&
    cache.validators
  ) || undefined;
}

export default createNamedHook('useValidatorsWaiting', useValidatorsWaitingImpl);
