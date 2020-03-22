// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedReferendumVote, DerivedReferendum } from '@polkadot/api-derive/types';
import { ReferendumInfoTo239, ReferendumStatus } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';

interface State {
  voteCount: number;
  voteCountAye: number;
  voteCountNay: number;
  votedAye: BN;
  votedNay: BN;
  votedTotal: BN;
}

const EMPTY_STATE = {
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

function calcOldState (votesFor: DerivedReferendumVote[]): State {
  return votesFor.reduce((state, { balance, vote }): State => {
    const isDefault = vote.conviction.index === 0;
    const counted = balance
      .muln(isDefault ? 1 : vote.conviction.index)
      .divn(isDefault ? 10 : 1);

    if (vote.isAye) {
      state.voteCountAye++;
      state.votedAye = state.votedAye.add(counted);
    } else {
      state.voteCountNay++;
      state.votedNay = state.votedNay.add(counted);
    }

    state.voteCount++;
    state.votedTotal = state.votedTotal.add(counted);

    return state;
  }, {
    voteCount: 0,
    voteCountAye: 0,
    voteCountNay: 0,
    votedAye: new BN(0),
    votedNay: new BN(0),
    votedTotal: new BN(0)
  });
}

export default function useVotes (referendum: DerivedReferendum): State {
  const { api } = useApi();
  const votesFor = useCall<DerivedReferendumVote[]>(api.query.democracy.votersFor && api.derive.democracy.referendumVotesFor as any, [referendum.index]);
  const [state, setState] = useState<State>({ ...EMPTY_STATE });

  useEffect((): void => {
    isCurrentStatus(referendum.status) && setState({
      ...EMPTY_STATE,
      votedAye: referendum.status.tally.ayes,
      votedNay: referendum.status.tally.nays,
      votedTotal: referendum.status.tally.turnout
    });
  }, [referendum]);

  useEffect((): void => {
    votesFor && setState(
      calcOldState(votesFor)
    );
  }, [votesFor]);

  return state;
}
