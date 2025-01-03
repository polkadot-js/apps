// Copyright 2017-2025 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveTreasuryProposal } from '@polkadot/api-derive/types';

import React, { useMemo } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Proposal from './Proposal.js';

interface Props {
  className?: string;
  isApprovals?: boolean;
  isMember: boolean;
  members: string[];
  proposals?: DeriveTreasuryProposal[];
}

function ProposalsBase ({ className = '', isApprovals, isMember, members, proposals }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const header = useMemo<([React.ReactNode?, string?, number?] | false)[]>(() => [
    [isApprovals ? t('Approved') : t('Proposals'), 'start', 2],
    [],
    [t('proposer'), 'address'],
    [],
    []
  ], [isApprovals, t]);

  return (
    <Table
      className={className}
      empty={proposals && (isApprovals ? t('No approved proposals') : t('No pending proposals'))}
      header={header}
    >
      {proposals?.map((proposal): React.ReactNode => (
        <Proposal
          isMember={isMember}
          key={proposal.id.toString()}
          members={members}
          proposal={proposal}
          withSend={!isApprovals}
        />
      ))}
    </Table>
  );
}

export default React.memo(ProposalsBase);
