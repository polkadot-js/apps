// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletConvictionVotingVoteVoting } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PalletVote } from '../../types';
import type { LockResult, VoteResult } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import useVotingLocks from './useVotingLocks';

type ForParam = [accountId: string, classId: BN];

const FOR_OPT = {
  transform: ([[ids], votes]: [[[string, BN][]], PalletConvictionVotingVoteVoting[]]): VoteResult =>
    ids.reduce<VoteResult>((all, [accountId, classId], index) => {
      if (!all[accountId]) {
        all[accountId] = [];
      }

      all[accountId].push({
        casting: votes[index].isCasting
          ? votes[index].asCasting.votes.map(([refId]) => ({ refId }))
          : undefined,
        classId,
        isDelegating: votes[index].isDelegating
      });

      return all;
    }, {}),
  withParamsTransform: true
};

function getParams (locks?: LockResult | null): ForParam[] | null | undefined {
  return locks && Object.entries(locks).reduce<ForParam[]>((all, [accountId, items]) => {
    return items.reduce<ForParam[]>((all, { classId }) => {
      all.push(([accountId, classId]));

      return all;
    }, all);
  }, []);
}

function combineResult (locks: LockResult, votes: VoteResult): VoteResult {
  return Object.keys(locks).reduce<VoteResult>((all, accountId) => {
    if (!all[accountId]) {
      // when it appears in the original keys, but not here
      // we just add an empty value to keep track of this one
      all[accountId] = [];
    }

    return all;
  }, votes);
}

function useVotingForImpl (palletVote: PalletVote, accountIds?: string[] | null): VoteResult | null | undefined {
  const { api } = useApi();
  const locks = useVotingLocks(palletVote, accountIds);

  const forParam = useMemo(
    () => [getParams(locks)],
    [locks]
  );

  const votes = useCall(forParam && forParam[0] && api.query[palletVote]?.votingFor?.multi, forParam, FOR_OPT);

  return useMemo(
    () => locks && forParam
      ? forParam[0]
        ? isFunction(api.query[palletVote]?.votingFor)
          ? votes && combineResult(locks, votes)
          : locks
        : {}
      : null,
    [api, locks, forParam, palletVote, votes]
  );
}

export default createNamedHook('useVotingFor', useVotingForImpl);
