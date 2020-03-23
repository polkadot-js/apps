// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedReferendumVote, DerivedReferendum } from '@polkadot/api-derive/types';
import { ReferendumInfoTo239, ReferendumStatus, Tally } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';

interface State {
  allAye: DerivedReferendumVote[];
  allNay: DerivedReferendumVote[];
  voteCount: number;
  voteCountAye: number;
  voteCountNay: number;
  votedAye: BN;
  votedNay: BN;
  votedTotal: BN;
}

const EMPTY_STATE: State = {
  allAye: [],
  allNay: [],
  voteCount: 0,
  voteCountAye: 0,
  voteCountNay: 0,
  votedAye: new BN(0),
  votedNay: new BN(0),
  votedTotal: new BN(0)
};

function isCurrentStatus (status: ReferendumStatus | ReferendumInfoTo239): status is ReferendumStatus {
  return !!(status as ReferendumStatus).tally;
}

function calcStateOld (votesFor: DerivedReferendumVote[]): State {
  return votesFor.reduce((state: State, derived): State => {
    const { balance, vote } = derived;
    const isDefault = vote.conviction.index === 0;
    const counted = balance
      .muln(isDefault ? 1 : vote.conviction.index)
      .divn(isDefault ? 10 : 1);

    if (vote.isAye) {
      state.allAye.push(derived);
      state.voteCountAye++;
      state.votedAye = state.votedAye.add(counted);
    } else {
      state.allNay.push(derived);
      state.voteCountNay++;
      state.votedNay = state.votedNay.add(counted);
    }

    state.voteCount++;
    state.votedTotal = state.votedTotal.add(counted);

    return state;
  }, {
    allAye: [],
    allNay: [],
    voteCount: 0,
    voteCountAye: 0,
    voteCountNay: 0,
    votedAye: new BN(0),
    votedNay: new BN(0),
    votedTotal: new BN(0)
  });
}

function calcState (tally: Tally, votes: DerivedReferendumVote[] = []): State {
  const allAye: DerivedReferendumVote[] = [];
  const allNay: DerivedReferendumVote[] = [];

  votes.forEach((derived): void => {
    if (derived.vote.isAye) {
      allAye.push(derived);
    } else {
      allNay.push(derived);
    }
  });

  return {
    allAye,
    allNay,
    voteCount: allAye.length + allNay.length,
    voteCountAye: allAye.length,
    voteCountNay: allNay.length,
    votedAye: tally.ayes,
    votedNay: tally.nays,
    votedTotal: tally.turnout
  };
}

export default function useVotes (referendum: DerivedReferendum): State {
  const { api } = useApi();
  const votes = useCall<DerivedReferendumVote[]>(api.derive.democracy.referendumVotes as any, [referendum.index]);
  const [state, setState] = useState<State>({ ...EMPTY_STATE });

  useEffect((): void => {
    if (isCurrentStatus(referendum.status)) {
      setState(calcState(referendum.status.tally, votes));
    } else if (votes) {
      setState(calcStateOld(votes));
    }
  }, [referendum, votes]);

  return state;
}
