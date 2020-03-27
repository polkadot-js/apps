// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSociety } from '@polkadot/api-derive/types';

import React from 'react';
import styled from 'styled-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import useMembers from '../useMembers';
import Bids from './Bids';
import Candidates from './Candidates';
import Defender from './Defender';
import Members from './Members';
import Summary from './Summary';

interface Props {
  className?: string;
}

function Overview ({ className }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const info = useCall<DeriveSociety>(api.derive.society.info, []);
  const { allMembers, isMember, ownMembers } = useMembers();

  return (
    <div className={className}>
      <Summary info={info} />
      <Defender
        allMembers={allMembers}
        info={info}
        isMember={isMember}
        ownMembers={ownMembers}
      />
      <Members info={info} />
      <Candidates
        allMembers={allMembers}
        isMember={isMember}
        ownMembers={ownMembers}
      />
      <Bids />
    </div>
  );
}

export default React.memo(styled(Overview)`
  .overviewSection {
    margin-bottom: 1.5rem;
  }
`);
