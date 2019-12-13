/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedTreasuryProposal } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Table } from '@polkadot/react-components';

import Proposal from './Proposal';
import translate from '../translate';

interface Props extends I18nProps {
  proposals: DerivedTreasuryProposal[];
  isApprovals?: boolean;
}

function ProposalsBase ({ className, proposals, isApprovals, t }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <h1>{isApprovals ? t('Approved') : t('Proposals')}</h1>
      {(!proposals || !proposals.length) && (
        isApprovals ? t('No approved proposals') : t('No pending proposals')
      )}
      <Table>
        <Table.Body>
          {proposals?.map((proposal): React.ReactNode => (
            <Proposal
              isApproved={isApprovals}
              proposal={proposal}
              key={proposal.id.toString()}
            />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default translate(ProposalsBase);
