// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveTreasuryProposal } from '@polkadot/api-derive/types';

import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Table } from '@polkadot/react-components';

import Proposal from './Proposal';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isApprovals?: boolean;
  isMember: boolean;
  proposals?: DeriveTreasuryProposal[];
}

function ProposalsBase ({ className, isApprovals, isMember, proposals }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const history = useHistory();

  const _onRespond = useCallback(
    (): void => {
      history.push('/council/motions');
    },
    [history]
  );

  return (
    <Table
      className={className}
      empty={proposals && (isApprovals ? t('No approved proposals') : t('No pending proposals'))}
      header={[
        [isApprovals ? t('Approved') : t('Proposals'), 'start', 2],
        [t('beneficiary'), 'address'],
        [t('payment')],
        [t('bond')],
        [undefined, undefined, 2]
      ]}
    >
      {proposals?.map((proposal): React.ReactNode => (
        <Proposal
          isMember={isMember}
          key={proposal.id.toString()}
          onRespond={_onRespond}
          proposal={proposal}
          withSend={!isApprovals}
        />
      ))}
    </Table>
  );
}

export default React.memo(ProposalsBase);
