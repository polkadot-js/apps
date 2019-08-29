// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedElectionsInfo } from '@polkadot/api-derive/types';
import { BlockNumber, SetIndex, VoteIndex } from '@polkadot/types/interfaces';
import { ComponentProps as Props } from './types';

import BN from 'bn.js';
import React from 'react';
import { withCalls } from '@polkadot/react-api';
import { Button } from '@polkadot/react-components';

import Members from './Members';
import SubmitCandidacy from './SubmitCandidacy';
import Summary from './Summary';
import Vote from './Vote';

const NULL_INFO: DerivedElectionsInfo = {
  members: {},
  candidates: [],
  candidateCount: new BN(0),
  desiredSeats: new BN(0),
  nextVoterSet: new BN(0) as SetIndex,
  termDuration: new BN(0) as BlockNumber,
  voteCount: new BN(0) as VoteIndex,
  voterCount: new BN(0) as SetIndex
};

function Overview ({ electionsInfo = NULL_INFO }: Props): React.ReactElement<Props> {
  return (
    <>
      <Summary electionsInfo={electionsInfo} />
      <Button.Group>
        <SubmitCandidacy electionsInfo={electionsInfo} />
        <Button.Or />
        <Vote electionsInfo={electionsInfo} />
      </Button.Group>
      <Members electionsInfo={electionsInfo} />
    </>
  );
}

export default withCalls<Props>(
  [
    'derive.elections.info',
    {
      propName: 'electionsInfo'
    }
  ]
)(Overview);
