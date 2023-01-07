// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { INumber } from '@polkadot/types/types';
import type { PalletVote } from '../../types';
import type { Result } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

const LOCKS_OPT = {
  transform: ([[ids], locks]: [[string[]], [INumber, INumber][][]]): Result =>
    ids.reduce<Result>((all, id, index) => ({
      ...all,
      [id]: locks[index].map(([classId, value]) =>
        [classId.toNumber(), value.toBn()]
      )
    }), {}),
  withParamsTransform: true
};

function useVotingLocksImpl (palletVote: PalletVote, accountIds?: string[] | null): Result | null | undefined {
  const { api } = useApi();
  const locksParam = useMemo(
    () => accountIds
      ? accountIds.length
        ? [accountIds]
        : []
      : undefined,
    [accountIds]
  );
  const locks = useCall(locksParam && locksParam[0] && api.query[palletVote]?.classLocksFor?.multi, locksParam, LOCKS_OPT);

  return useMemo(
    () => locksParam
      ? locksParam[0]
        ? isFunction(api.query[palletVote]?.classLocksFor)
          ? locks
          : locksParam[0].reduce<Result>((all, id) => ({ ...all, [id]: [] }), {})
        : {}
      : null,
    [api, locks, locksParam, palletVote]
  );
}

export default createNamedHook('useVotingLocks', useVotingLocksImpl);
