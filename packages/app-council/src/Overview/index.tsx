// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, BlockNumber } from '@polkadot/types';
import { ElectionsInfo } from './types';

import BN from 'bn.js';
import React from 'react';

import { withCalls } from '@polkadot/ui-api';

import Members from './Members';
import SubmitCandidacy from './SubmitCandidacy';
import Summary from './Summary';

interface Props {
  elections_members?: [string, BlockNumber][];
  elections_candidates?: string[];
  elections_candidateCount?: BN;
  elections_desiredSeats?: BN;
  elections_termDuration?: BN;
  elections_voteCount?: BN;
}

interface State {
  electionsInfo: ElectionsInfo;
}

class Overview extends React.PureComponent<Props, State> {
  public static getDerivedStateFromProps ({
    elections_members: members = [],
    elections_candidates: candidates = [],
    elections_candidateCount: candidateCount = new BN(0),
    elections_desiredSeats: desiredSeats = new BN(0),
    elections_termDuration: termDuration = new BN(0),
    elections_voteCount: voteCount = new BN(0)
  }: Props): State {
    const electionsInfo: ElectionsInfo = {
      members, candidates, candidateCount, desiredSeats, termDuration, voteCount
    };

    return { electionsInfo };
  }

  public render (): React.ReactNode {
    const { electionsInfo } = this.state;

    return (
      <>
        <Summary electionsInfo={electionsInfo} />
        <SubmitCandidacy electionsInfo={electionsInfo} />
        <Members electionsInfo={electionsInfo} />
      </>
    );
  }
}

export default withCalls<Props>(
  ['query.elections.members', {
    transform: (active: [AccountId, BlockNumber][]): [string, BlockNumber][] =>
      active.map(([accountId, blockNumber]): [string, BlockNumber] =>
        [accountId.toString(), blockNumber]
      )
  }],
  ['query.elections.candidates', {
    transform: (candidates: AccountId[]): string[] =>
      candidates.map((accountId): string =>
        accountId.toString()
      )
  }],
  'query.elections.candidateCount',
  'query.elections.desiredSeats',
  'query.elections.termDuration',
  'query.elections.voteCount'
)(Overview);
