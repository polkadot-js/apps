// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletConvictionVotingVoteVoting } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PalletVote } from '../../types.js';
import type { LockResult, VoteResult, VoteResultItem } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import useVotingLocks from './useVotingLocks.js';

type ForParam = [accountId: string, classId: BN];

const FOR_OPT = {
  transform: ([[ids], votes]: [[ForParam[]], PalletConvictionVotingVoteVoting[]]): VoteResult =>
    ids.sort((a, b) => a[1].cmp(b[1])).reduce<VoteResult>((all, [accountId, classId], index) => {
      if (!all[accountId]) {
        all[accountId] = [];
      }

      let casting: VoteResultItem['casting'] | undefined;
      let delegating: VoteResultItem['delegating'] | undefined;

      if (votes[index].isCasting) {
        casting = votes[index].asCasting.votes.map(([refId]) => ({ refId }));
      } else if (votes[index].isDelegating) {
        const { conviction, target } = votes[index].asDelegating;

        delegating = { conviction: conviction.type, targetId: target.toString() };
      } else {
        // failsafe log... just in-case
        console.error(`Unable to handle PalletConvictionVotingVoteVoting type ${votes[index].type}`);
      }

      all[accountId].push({ casting, classId, delegating });

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

  const votes = useCall(forParam?.[0] && api.query[palletVote]?.votingFor?.multi, forParam, FOR_OPT);

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
