// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedElectionsInfo } from '@polkadot/api-derive/types';
import { ComponentProps as Props } from './types';

import React from 'react';
import { withCalls } from '@polkadot/react-api';
import { Button } from '@polkadot/react-components';
import { createType } from '@polkadot/types';

import Members from './Members';
import SubmitCandidacy from './SubmitCandidacy';
import Summary from './Summary';
import Vote from './Vote';

const NULL_INFO: DerivedElectionsInfo = {
  members: {},
  candidates: [],
  candidateCount: createType('u32'),
  desiredSeats: createType('u32'),
  nextVoterSet: createType('SetIndex'),
  termDuration: createType('BlockNumber'),
  voteCount: createType('VoteIndex'),
  voterCount: createType('SetIndex')
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
