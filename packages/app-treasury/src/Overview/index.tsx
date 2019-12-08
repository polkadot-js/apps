// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps, I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { useApi, useStream } from '@polkadot/react-hooks';

import Summary from './Summary';
import Proposals from './Proposals';
import Propose from './Propose';

interface Props extends AppProps, BareProps, I18nProps {}

export default function Overview ({ className }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const approvalIds = useStream<BN[]>(api.query.treasury.approvals, []);
  const proposalCount = useStream<BN>(api.query.treasury.proposalCount, []);
  const [proposalIds, setProposalIds] = useState<BN[]>([]);

  useEffect((): void => {
    if (approvalIds && proposalCount) {
      const proposalIds: BN[] = [];

      for (let i = 0; i < proposalCount.toNumber(); i++) {
        if (!approvalIds.find((index): boolean => index.eqn(i))) {
          proposalIds.push(new BN(i));
        }
      }

      setProposalIds(proposalIds);
    }
  }, [approvalIds, proposalCount]);

  return (
    <div className={className}>
      <Summary
        approvalCount={approvalIds?.length}
        proposalCount={proposalIds?.length}
      />
      <Propose />
      <Proposals ids={proposalIds} />
      <Proposals ids={approvalIds} isApprovals />
    </div>
  );
}
