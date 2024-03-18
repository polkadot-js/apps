// Copyright 2017-2024 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveTreasuryProposals } from '@polkadot/api-derive/types';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useCall } from '@polkadot/react-hooks';
import { useApi } from '../hooks/useApi.js'

import ProposalCreate from './ProposalCreate.js';
import Proposals from './Proposals.js';
import Summary from './Summary.js';

import '../codegen/augment-api.js'
import '../codegen/augment-types.js'


interface Props {
  className?: string;
  isMember: boolean;
  members: string[];
}

function Overview ({ className, isMember, members }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();
  const info = useCall<DeriveTreasuryProposals>(isApiReady && api.derive.treasury.proposals);

  return (
    <div className={className}>
      <Summary
        approvalCount={info?.approvals.length}
        proposalCount={info?.proposals.length}
      />
      <Button.Group>
        <ProposalCreate />
      </Button.Group>
      <Proposals
        isMember={isMember}
        members={members}
        proposals={info?.proposals}
      />
      <Proposals
        isApprovals
        isMember={isMember}
        members={members}
        proposals={info?.approvals}
      />
    </div>
  );
}

export default React.memo(Overview);
