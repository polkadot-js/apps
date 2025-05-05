// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo, Validator } from './types.js';

import { useMemo } from 'react';

import { createNamedHook } from '@polkadot/react-hooks';

import { useCacheValue } from './useCache.js';
import useValidatorsAll from './useValidatorsAll.js';

function excludeValidators (from: Validator[], exclude: Validator[]): Validator[] {
  return from.filter(({ stashId }) =>
    !exclude.some((v) => v.stashId === stashId)
  );
}

function useValidatorsWaitingImpl (favorites: string[], sessionInfo: SessionInfo, activeValidators?: Validator[]): Validator[] | undefined {
  const allValidators = useValidatorsAll(favorites, sessionInfo);

  // both active and all is already sorted and tagged, so we don't
  // need to re-sort the waiting list
  const tagged = useMemo(
    () => allValidators && activeValidators && excludeValidators(allValidators, activeValidators),
    [activeValidators, allValidators]
  );

  return useCacheValue('useValidatorsWaiting', tagged);
}

export default createNamedHook('useValidatorsWaiting', useValidatorsWaitingImpl);
