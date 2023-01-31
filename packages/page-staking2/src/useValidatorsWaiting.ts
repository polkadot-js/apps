// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo, Validator } from './types';

import { useEffect, useMemo } from 'react';

import { createNamedHook } from '@polkadot/react-hooks';

import useValidatorsAll from './useValidatorsAll';

function excludeValidators (from?: Validator[], exclude?: Validator[]): Validator[] | undefined {
  return from && exclude && from.filter(({ stashId }) =>
    !exclude.some((v) => v.stashId === stashId)
  );
}

let cache: Validator[] | undefined;

function useValidatorsWaitingImpl (favorites: string[], sessionInfo: SessionInfo, activeValidators?: Validator[]): Validator[] | undefined {
  const allValidators = useValidatorsAll(favorites, sessionInfo);

  // both active and all is already sorted and tagged, so we don't
  // need to re-sort the waiting list
  const result = useMemo(
    () => excludeValidators(allValidators, activeValidators),
    [activeValidators, allValidators]
  );

  useEffect((): void => {
    if (result) {
      cache = result;
    }
  }, [result]);

  return result || cache;
}

export default createNamedHook('useValidatorsWaiting', useValidatorsWaitingImpl);
