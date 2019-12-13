// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedTreasuryProposals } from '@polkadot/api-derive/types';
import { AppProps, BareProps, I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';

import Summary from './Summary';
import Proposals from './Proposals';
import Propose from './Propose';

interface Props extends AppProps, BareProps, I18nProps {}

export default function Overview ({ className }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const allProposals = useCall<DerivedTreasuryProposals>(api.derive.treasury.proposals, []);
  
  if (!allProposals) {
    return null;
  }

  const { approvals, proposals, proposalCount } = allProposals;

  return (
    <div className={className}>
      <Summary
        approvalCount={approvals?.length}
        proposalCount={proposalCount.toNumber()}
      />
      <Propose />
      <Proposals proposals={proposals} />
      <Proposals proposals={approvals} isApprovals />
    </div>
  );
}
