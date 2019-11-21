// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedElectionsInfo } from '@polkadot/api-derive/types';
import { BlockNumber } from '@polkadot/types/interfaces';
import { ComponentProps } from './types';

import React from 'react';
import { withCalls, registry } from '@polkadot/react-api';
import { Button } from '@polkadot/react-components';
import { createType } from '@polkadot/types';

import Members from './Members';
import SubmitCandidacy from './SubmitCandidacy';
import Summary from './Summary';
import Vote from './Vote';

interface Props extends ComponentProps {
  bestNumber?: BlockNumber;
}

const NULL_INFO: DerivedElectionsInfo = {
  candidates: [],
  candidateCount: createType(registry, 'u32'),
  desiredSeats: createType(registry, 'u32'),
  members: [],
  runnersUp: [],
  termDuration: createType(registry, 'BlockNumber')
};

function Overview ({ bestNumber, electionsInfo = NULL_INFO }: Props): React.ReactElement<Props> {
  return (
    <>
      <Summary
        bestNumber={bestNumber}
        electionsInfo={electionsInfo}
      />
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
  ['derive.elections.info', {
    propName: 'electionsInfo'
  }],
  ['derive.chain.bestNumber', {
    propName: 'bestNumber'
  }]
)(Overview);
