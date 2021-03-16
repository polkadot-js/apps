// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSociety } from '@polkadot/api-derive/types';

import React from 'react';
import styled from 'styled-components';

import { useApi, useCall } from '@polkadot/react-hooks';

import Defender from './Defender';
import Members from './Members';
import Summary from './Summary';

interface Props {
  className?: string;
  isMember: boolean;
  ownMembers: string[];
}

function Overview ({ className, isMember, ownMembers }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const info = useCall<DeriveSociety>(api.derive.society.info);

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
