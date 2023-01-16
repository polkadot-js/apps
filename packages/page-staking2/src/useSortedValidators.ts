// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Validator } from './types';

import { useCallback, useMemo } from 'react';

import { createNamedHook, useAccounts } from '@polkadot/react-hooks';

function sortFn (check: string[], a: Validator, b: Validator): number {
  const isA = check.includes(a.stashId);

  return isA === check.includes(b.stashId)
    ? 0
    : isA
      ? -1
      : 1;
}

export function useSortedValidatorsImpl (favorites: string[], validators?: Validator[]): Validator[] | undefined {
  const { allAccounts } = useAccounts();

  const sortAccounts = useCallback(
    (a: Validator, b: Validator) => sortFn(allAccounts, a, b),
    [allAccounts]
  );

  const sortFavorites = useCallback(
    (a: Validator, b: Validator) => sortFn(favorites, a, b),
    [favorites]
  );

  return useMemo(
    () => validators && validators
      .sort(sortAccounts)
      .sort(sortFavorites),
    [sortAccounts, sortFavorites, validators]
  );
}

export default createNamedHook('useSortedValidators', useSortedValidatorsImpl);
