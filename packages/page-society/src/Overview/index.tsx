// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { DeriveSociety } from '@polkadot/api-derive/types';
import type { MapMember } from '../types';

import React from 'react';
import styled from 'styled-components';

import Defender from './Defender';
import Members from './Members';
import Summary from './Summary';

interface Props {
  className?: string;
  info?: DeriveSociety;
  isMember: boolean;
  mapMembers?: MapMember[];
  ownMembers: string[];
  payoutTotal?: BN;
}

function Overview ({ className, info, isMember, mapMembers, ownMembers, payoutTotal }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <Summary
        info={info}
        payoutTotal={payoutTotal}
      />
      <Defender
        info={info}
        isMember={isMember}
        ownMembers={ownMembers}
      />
      <Members mapMembers={mapMembers} />
    </div>
  );
}

export default React.memo(styled(Overview)`
  .overviewSection {
    margin-bottom: 1.5rem;
  }
`);
