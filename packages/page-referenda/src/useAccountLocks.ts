// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Option } from '@polkadot/types';
import type { PalletConvictionVotingVoteCasting, PalletConvictionVotingVoteVoting, PalletReferendaReferendumInfoConvictionVotingTally } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { Lock, PalletReferenda, PalletVote } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { BN_MAX_INTEGER } from '@polkadot/util';

const OPT_CLASS = {
  transform: (locks: [BN, BN][]): BN[] =>
    locks.map(([classId]) => classId)
};

const OPT_VOTES = {
  transform: ([[params], votes]: [[[string, BN][]], PalletConvictionVotingVoteVoting[]]): [classId: BN, refIds: BN[], casting: PalletConvictionVotingVoteCasting][] =>
    votes
      .map((v, index): null | [BN, BN[], PalletConvictionVotingVoteCasting] => {
        if (!v.isCasting) {
          return null;
        }

        const casting = v.asCasting;

        return [
          params[index][1],
          casting.votes.map(([refId]) => refId),
          casting
        ];
      })
      .filter((v): v is [BN, BN[], PalletConvictionVotingVoteCasting] => !!v),
  withParamsTransform: true
};

const OPT_REFS = {
  transform: ([[params], optTally]: [[BN[]], Option<PalletReferendaReferendumInfoConvictionVotingTally>[]]): [BN, PalletReferendaReferendumInfoConvictionVotingTally][] =>
    optTally
      .map((v, index): null | [BN, PalletReferendaReferendumInfoConvictionVotingTally] =>
        v.isSome
          ? [params[index], v.unwrap()]
          : null
      )
      .filter((v): v is [BN, PalletReferendaReferendumInfoConvictionVotingTally] => !!v),
  withParamsTransform: true
};

function getVoteParams (accountId: string, lockClasses?: BN[]): [[accountId: string, classId: BN][]] | undefined {
  if (lockClasses) {
    return [lockClasses.map((classId) => [accountId, classId])]
  }

  return undefined;
}

function getRefParams (votes?: [classId: BN, refIds: BN[], casting: PalletConvictionVotingVoteCasting][]): [BN[]] | undefined {
  if (votes && votes.length) {
    const refIds = votes.reduce<BN[]>((all, [, refIds]) => all.concat(refIds), []);

    if (refIds.length) {
      return [refIds];
    }
  }

  return undefined;
}

function getLocks (api: ApiPromise, palletVote: PalletVote, votes: [BN, BN[], PalletConvictionVotingVoteCasting][], referenda: [BN, PalletReferendaReferendumInfoConvictionVotingTally][]): Lock[] {
  const lockPeriod = api.consts[palletVote].voteLockingPeriod as BN;
  const locks: Lock[] = [];

  for (let i = 0; i < votes.length; i++) {
    const [,, casting] = votes[i];

    for (let i = 0; i < casting.votes.length; i++) {
      const [refId, accountVote] = casting.votes[i];
      const refInfo = referenda.find(([id]) => id.eq(refId));

      if (refInfo) {
        const [, tally] = refInfo;
        let total: BN | undefined;
        let endBlock: BN| undefined;
        let conviction = 0;

        if (accountVote.isStandard) {
          const { balance, vote } = accountVote.asStandard;

          total = balance;

          if ((tally.isApproved && vote.isAye) || (tally.isRejected && vote.isNay)) {
            conviction = vote.conviction.index;
          }
        } else if (accountVote.isSplit || accountVote.isSplitAbstain) {
          const { aye, nay } = accountVote.isSplit
            ? accountVote.asSplit
            : accountVote.asSplitAbstain;

          total = aye.add(nay);
        } else {
          console.error(`Unable to handle ${accountVote.type}`);
        }

        if (tally.isOngoing) {
          endBlock = BN_MAX_INTEGER;
        } else if (tally.isKilled) {
          endBlock = tally.asKilled;
        } else if (tally.isCancelled || tally.isTimedOut) {
          endBlock = tally.isCancelled
            ? tally.asCancelled[0]
            : tally.asTimedOut[0];
        } else if (tally.isApproved || tally.isRejected) {
          endBlock = lockPeriod
            .muln(conviction)
            .add(
              tally.isApproved
                ? tally.asApproved[0]
                : tally.asRejected[0]
            );
        } else {
          console.error(`Unable to handle ${tally.type}`);
        }

        if (total && endBlock) {
          locks.push({ endBlock, total });
        }
      }
    }
  }

  return locks;
}

function useAccountLocksImpl (palletReferenda: PalletReferenda, palletVote: PalletVote, accountId: string, isActive = true): Lock[] | undefined {
  const { api } = useApi();

  // retrieve the locks for the account (all classes) via the accountId
  const lockParams = useMemo(
    () => [accountId],
    [accountId]
  );

  const lockClasses = useCall<BN[] | undefined>(isActive && api.query[palletVote].classLocksFor, lockParams, OPT_CLASS);

  // retrieve the specific votes casted over the classes & accountId
  const voteParams = useMemo(
    () => getVoteParams(accountId, lockClasses),
    [accountId, lockClasses]
  );

  const votes = useCall<[BN, BN[], PalletConvictionVotingVoteCasting][] | undefined>(voteParams && api.query[palletVote].votingFor.multi, voteParams, OPT_VOTES);

  // retrieve the referendums that were voted on
  const refParams = useMemo(
    () => getRefParams(votes),
    [votes]
  );

  const referenda = useCall(refParams && api.query[palletReferenda].referendumInfoFor.multi, refParams, OPT_REFS);

  // combine the referenda outcomes and the votes into locks
  return useMemo(
    () => votes && referenda && getLocks(api, palletVote, votes, referenda),
    [api, palletVote, referenda, votes]
  );
}

export default createNamedHook('useAccountLocks', useAccountLocksImpl);
