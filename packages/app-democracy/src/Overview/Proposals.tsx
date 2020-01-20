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

export default function Proposals ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const proposals = useCall<DeriveProposal[]>(api.derive.democracy.proposals, []);

  return (
    <div className={`proposalSection ${className}`}>
      <h1>{t('proposals')}</h1>
      {proposals?.length
        ? (
          <Table>
            <Table.Body>
              {proposals.map((proposal): React.ReactNode => (
                <ProposalDisplay
                  key={proposal.index.toString()}
                  value={proposal}
                />
              ))}
            </Table.Body>
          </Table>
        )
        : t('No active proposals')
      }
    </div>
  );
}
