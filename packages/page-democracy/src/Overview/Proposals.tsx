// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveProposal } from '@polkadot/api-derive/types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import ProposalDisplay from './Proposal';

interface Props {
  className?: string;
}

function Proposals ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const proposals = useCall<DeriveProposal[]>(api.derive.democracy.proposals);

  const headerRef = useRef([
    [t('proposals'), 'start', 2],
    [t('proposer'), 'address'],
    [t('locked'), 'media--1200'],
    [undefined, undefined, 2],
    [undefined, 'media--1000']
  ]);

  return (
    <Table
      className={className}
      empty={proposals && t<string>('No active proposals')}
      header={headerRef.current}
    >
      {proposals?.map((proposal): React.ReactNode => (
        <ProposalDisplay
          key={proposal.index.toString()}
          value={proposal}
        />
      ))}
    </Table>
  );
}

export default React.memo(Proposals);
