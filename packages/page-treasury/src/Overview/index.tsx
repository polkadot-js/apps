// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveTreasuryProposals } from '@polkadot/api-derive/types';
import { AppProps, BareProps, I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Button } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import Summary from './Summary';
import Proposals from './Proposals';
import Propose from './Propose';

interface Props extends AppProps, BareProps, I18nProps {}

function Overview ({ className }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const info = useCall<DeriveTreasuryProposals>(api.derive.treasury.proposals, []);

  return (
    <div className={className}>
      <Summary
        approvalCount={info?.proposals.length}
        proposalCount={info?.approvals.length}
      />
      <Button.Group>
        <Propose />
      </Button.Group>
      <Proposals proposals={info?.proposals} />
      <Proposals proposals={info?.approvals} isApprovals />
    </div>
  );
}

export default React.memo(Overview);
