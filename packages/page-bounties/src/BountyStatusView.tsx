// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyStatus } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';
import styled from 'styled-components';

import { LabelHelp } from '@polkadot/react-components';

import { insertSpaceBeforeCapitalLetter } from './helpers';
import { useTranslation } from './translate';
import { HelpMessages, StatusName } from './types';
import VotingDescription from './VotingDescription';

interface Props {
  bountyStatus: StatusName;
  className?: string;
  proposals?: DeriveCollectiveProposal[];
  status: BountyStatus;
}

function BountyStatusView ({ bountyStatus, className = '', proposals, status }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const statusHelpMessages = useRef<HelpMessages>({
    Active: t('This bounty has received approval and is currently being implemented.'),
    Approved: t('This bounty was approved by the council. When next treasury spend period comes, it will get funded.'),
    CuratorProposed: t('Curator has been proposed by council. The bounty is waiting for curator to accept the role.'),
    Funded: t('This bounty is approved and funded.'),
    PendingPayout: t('This bounty was completed and the beneficiary was awarded by the curator. Claiming the payout will be possible after delay has passed.'),
    Proposed: t('After a bounty was proposed the council decides whether to fund it or not.')
  });

  return (
    <div className={className}>
      <div className='bountyStatus'>
        {insertSpaceBeforeCapitalLetter(bountyStatus)}
        <LabelHelp
          help={statusHelpMessages.current[bountyStatus]}
        />
      </div>
      {proposals && (
        <div>
          <VotingDescription
            proposals={proposals}
            status={status}
          />
        </div>
      )}
    </div>
  );
}

export default React.memo(styled(BountyStatusView)`
  .bountyStatus {
    display: flex;
    align-items: flex-end;
  }
`);
