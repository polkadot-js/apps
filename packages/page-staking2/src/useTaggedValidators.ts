// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo, Validator } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useAccounts } from '@polkadot/react-hooks';
import { objectSpread } from '@polkadot/util';

import useElectedValidators from './useElectedValidators.js';

function sort (a: Validator, b: Validator): number {
  return a.isFavorite === b.isFavorite
    ? a.isOwned === b.isOwned
      ? a.isElected === b.isElected
        ? 0
        : a.isElected
          ? -1
          : 1
      : a.isOwned
        ? -1
        : 1
    : a.isFavorite
      ? -1
      : 1;
}

function withElected (validators: Validator[], elected: string[]): Validator[] {
  return validators.map((v): Validator => {
    const isElected = elected.includes(v.stashId);

    return v.isElected !== isElected
      ? objectSpread({}, v, { isElected })
      : v;
  });
}

function withSort (allAccounts: string[], favorites: string[], validators: Validator[]): Validator[] {
  return validators
    .map((v): Validator => {
      const isFavorite = favorites.includes(v.stashId);
      const isOwned = allAccounts.includes(v.stashId);

      return v.isFavorite !== isFavorite || v.isOwned !== isOwned
        ? objectSpread({}, v, { isFavorite, isOwned })
        : v;
    })
    .sort(sort);
}

function useTaggedValidatorsImpl (favorites: string[], sessionInfo: SessionInfo, validators?: Validator[]): Validator[] | undefined {
  const { allAccounts } = useAccounts();
  const elected = useElectedValidators(sessionInfo);

  const flagged = useMemo(
    () => elected && validators && withElected(validators, elected),
    [elected, validators]
  );

  return useMemo(
    () => flagged && withSort(allAccounts, favorites, flagged),
    [allAccounts, favorites, flagged]
  );
}

export default createNamedHook('useTaggedValidators', useTaggedValidatorsImpl);
