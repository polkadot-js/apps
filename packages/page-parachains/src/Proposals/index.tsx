// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Proposals } from '../types';

import React from 'react';

import Actions from './Actions';
import ProposalList from './Proposals';

interface Props {
  className?: string;
  proposals?: Proposals;
}

function ProposalsTab ({ className, proposals }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <Actions />
      <ProposalList proposals={proposals} />
    </div>
  );
}

export default React.memo(ProposalsTab);
