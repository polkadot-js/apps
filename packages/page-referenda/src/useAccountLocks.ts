// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Option } from '@polkadot/types';
import type { PalletConvictionVotingVoteCasting, PalletConvictionVotingVoteVoting, PalletReferendaReferendumInfoConvictionVotingTally } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PalletReferenda, PalletVote } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { BN_MAX_INTEGER, BN_ZERO } from '@polkadot/util';

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

function getResult (api: ApiPromise, palletVote: PalletVote, votes: [BN, BN[], PalletConvictionVotingVoteCasting][], referenda: [BN, PalletReferendaReferendumInfoConvictionVotingTally][]) {
  const lockPeriod = api.consts[palletVote].voteLockingPeriod;

  for (let i = 0; i < votes.length; i++) {
    const [,, casting] = votes[i];

    for (let i = 0; i < casting.votes.length; i++) {
      const [refId, votes] = casting.votes[i];
      const refInfo = referenda.find(([id]) => id.eq(refId));

      if (refInfo) {
        const [, tally] = refInfo;
        let endBlock: BN;

        if (tally.isOngoing) {
          endBlock = BN_MAX_INTEGER;
        } else if (tally.isCancelled || tally.isKilled || tally.isTimedOut) {
          endBlock = BN_ZERO;
        } else if (tally.isApproved) {

        } else if (tally.isRejected) {

        } else {
          console.error(`Unable to handle ${tally.type}`);
        }
      }
    }
  }
}

function useAccountLocksImpl (palletReferenda: PalletReferenda, palletVote: PalletVote, accountId: string, isActive = true) {
  const { api } = useApi();

  const lockParams = useMemo(
    () => [accountId],
    [accountId]
  );

  const lockClasses = useCall<BN[] | undefined>(isActive && api.query[palletVote].classLocksFor, lockParams, OPT_CLASS);

  const voteParams = useMemo(
    () => getVoteParams(accountId, lockClasses),
    [accountId, lockClasses]
  );

  const votes = useCall<[BN, BN[], PalletConvictionVotingVoteCasting][] | undefined>(voteParams && api.query[palletVote].votingFor.multi, voteParams, OPT_VOTES);

  const refParams = useMemo(
    () => getRefParams(votes),
    [votes]
  );

  const referenda = useCall(refParams && api.query[palletReferenda].referendumInfoFor.multi, refParams, OPT_REFS);

  return useMemo(
    () => votes && referenda && getResult(api, palletReferenda, votes, referenda),
    [api, palletReferenda, referenda, votes]
  );
}

export default createNamedHook('useAccountLocks', useAccountLocksImpl);
