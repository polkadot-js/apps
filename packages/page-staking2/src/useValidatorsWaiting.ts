// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo, Validator } from './types';

import { useMemo } from 'react';

import { createNamedHook } from '@polkadot/react-hooks';

import useValidatorsActive from './useValidatorsActive';
import useValidatorsAll from './useValidatorsAll';

function excludeValidators (from?: Validator[], exclude?: Validator[]): Validator[] | undefined {
  return from && exclude && from.filter(({ stashId }) =>
    !exclude.some((v) => v.stashId === stashId)
  );
}

function useValidatorsWaitingImpl (favorites: string[], sessionInfo: SessionInfo): Validator[] | undefined {
  const activeValidators = useValidatorsActive(favorites, sessionInfo);
  const allValidators = useValidatorsAll(favorites, sessionInfo);

  // both active and all is already sorted and tagged, so we don't
  // need to re-sort the waiting list
  return useMemo(
    () => excludeValidators(allValidators, activeValidators),
    [activeValidators, allValidators]
  );
}

export default createNamedHook('useValidatorsWaiting', useValidatorsWaitingImpl);
