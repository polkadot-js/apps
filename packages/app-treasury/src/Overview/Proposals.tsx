/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Table } from '@polkadot/react-components';

import Proposal from './Proposal';
import translate from '../translate';

interface Props extends I18nProps {
  ids?: BN[];
  isApprovals?: boolean;
}

function ProposalsBase ({ className, ids, isApprovals, t }: Props): React.ReactElement<Props> {
  const history = useHistory();
  const [isEmpty, setIsEmpty] = useState(true);

  const _onRespond = (): void => {
    history.push('/council/motions');
  };
  const _onPopulateProposal = (): void => {
    isEmpty && setIsEmpty(false);
  };

  return (
    <div className={className}>
      <h1>{isApprovals ? t('Approved') : t('Proposals')}</h1>
      {isEmpty && (
        isApprovals ? t('No approved proposals') : t('No pending proposals')
      )}
      <Table>
        <Table.Body>
          {ids?.map((proposalId): React.ReactNode => (
            <Proposal
              isApproved={isApprovals}
              onPopulate={_onPopulateProposal}
              onRespond={_onRespond}
              proposalId={proposalId}
              key={proposalId.toString()}
            />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default translate(ProposalsBase);
