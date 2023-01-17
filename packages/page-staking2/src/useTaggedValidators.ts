// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo, Validator } from './types';

import { useMemo } from 'react';

import { createNamedHook, useAccounts } from '@polkadot/react-hooks';

import useElectedValidators from './useElectedValidators';

function withTags (validators?: Validator[], elected?: string[]): Validator[] | undefined {
  return elected
    ? validators && validators.map((v): Validator => {
      const isElected = elected.includes(v.stashId);

      return v.isElected !== isElected
        ? {
          isElected,
          key: v.key,
          stashId: v.stashId,
          stashIndex: v.stashIndex
        }
        : v;
    })
    : validators;
}

function sortFn (allAccounts: string[], favorites: string[]): (a: Validator, b: Validator) => number {
  return (a: Validator, b: Validator): number => {
    const isFavA = favorites.includes(a.stashId);

    if (isFavA === favorites.includes(b.stashId)) {
      const isAccA = allAccounts.includes(a.stashId);

      return isAccA === allAccounts.includes(b.stashId)
        ? 0
        : isAccA
          ? -1
          : 1;
    }

    return isFavA
      ? -1
      : 1;
  };
}

function useTaggedValidatorsImpl (favorites: string[], sessionInfo: SessionInfo, validators?: Validator[]): Validator[] | undefined {
  const { allAccounts } = useAccounts();
  const elected = useElectedValidators(sessionInfo);

  // these should only change once a session
  const flagged = useMemo(
    () => withTags(validators, elected),
    [elected, validators]
  );

  // this will change on a user action
  const sortAll = useMemo(
    () => sortFn(allAccounts, favorites),
    [allAccounts, favorites]
  );

  return useMemo(
    () => flagged && flagged.sort(sortAll),
    [flagged, sortAll]
  );
}

export default createNamedHook('useTaggedValidators', useTaggedValidatorsImpl);
