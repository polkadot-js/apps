// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSociety } from '@polkadot/api-derive/types';

import React from 'react';
import styled from 'styled-components';

import Defender from './Defender';
import Members from './Members';
import Summary from './Summary';

interface Props {
  className?: string;
  info?: DeriveSociety;
  isMember: boolean;
  ownMembers: string[];
}

function Overview ({ className, info, isMember, ownMembers }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <Summary info={info} />
      <Defender
        info={info}
        isMember={isMember}
        ownMembers={ownMembers}
      />
      <Members info={info} />
    </div>
  );
}

export default React.memo(styled(Overview)`
  .overviewSection {
    margin-bottom: 1.5rem;
  }
`);
