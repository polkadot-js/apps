// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { INumber } from '@polkadot/types/types';
import type { PalletVote } from '../../types.js';
import type { LockResult } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

const LOCKS_OPT = {
  transform: ([[ids], locks]: [[string[]], [INumber, INumber][][]]): LockResult =>
    ids.reduce<LockResult>((all, accountId, index) => ({
      ...all,
      [accountId]: locks[index].map(([classId, value]) => ({
        balance: value.toBn(),
        classId: classId.toBn()
      }))
    }), {}),
  withParamsTransform: true
};

function useVotingLocksImpl (palletVote: PalletVote, accountIds?: string[] | null): LockResult | null | undefined {
  const { api } = useApi();

  const locksParam = useMemo(
    () => accountIds
      ? accountIds.length
        ? [accountIds]
        : []
      : undefined,
    [accountIds]
  );

  const locks = useCall(locksParam?.[0] && api.query[palletVote]?.classLocksFor?.multi, locksParam, LOCKS_OPT);

  return useMemo(
    () => locksParam
      ? locksParam[0]
        ? isFunction(api.query[palletVote]?.classLocksFor)
          ? locks
          : locksParam[0].reduce<LockResult>((all, accountId) => ({ ...all, [accountId]: [] }), {})
        : {}
      : null,
    [api, locks, locksParam, palletVote]
  );
}

export default createNamedHook('useVotingLocks', useVotingLocksImpl);
