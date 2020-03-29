// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveProposal } from '@polkadot/api-derive/types';

import React from 'react';
import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import ProposalDisplay from './Proposal';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

function Proposals ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const proposals = useCall<DeriveProposal[]>(api.derive.democracy.proposals, []);

  return (
    <Table className={className}>
      <Table.Head>
        <th className='start' colSpan={2}><h1>{t('proposals')}</h1></th>
        <th className='address'>{t('proposer')}</th>
        <th>{t('locked')}</th>
        <th colSpan={3}>&nbsp;</th>
      </Table.Head>
      <Table.Body empty={proposals && t('No active proposals')}>
        {proposals?.map((proposal): React.ReactNode => (
          <ProposalDisplay
            key={proposal.index.toString()}
            value={proposal}
          />
        ))}
      </Table.Body>
    </Table>
  );
}

export default React.memo(Proposals);
