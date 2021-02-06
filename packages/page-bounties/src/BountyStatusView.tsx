// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyStatus } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useRef } from 'react';
import styled from 'styled-components';

import { LabelHelp } from '@polkadot/react-components';

import ExtendedStatus from './Voting/ExtendedStatus';
import { insertSpaceBeforeCapitalLetter } from './helpers';
import { useTranslation } from './translate';
import { HelpMessages, StatusName } from './types';

interface Props {
  blocksUntilPayout?: BN
  bountyStatus: StatusName;
  className?: string;
  proposals?: DeriveCollectiveProposal[];
  status: BountyStatus;
}

function BountyStatusView ({ blocksUntilPayout, bountyStatus, className = '', proposals, status }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const statusHelpMessages = useRef<HelpMessages>({
    Active: t('This bounty has received approval and is currently being implemented.'),
    Approved: t('This bounty was approved by the council. When the next spend period starts, it will be funded.'),
    CuratorProposed: t('Curator has been proposed by council. The bounty is waiting for curator to accept the role.'),
    Funded: t('This bounty is funded.'),
    PendingPayout: t('This bounty was completed and the beneficiary was rewarded by the curator. Claiming the payout will be possible after the delay period is over.'),
    Proposed: t('After a bounty was proposed the council decides whether to fund it or not.')
  });

  return (
    <div className={className}>
      <div className='bountyStatus'
        data-testid={'bountyStatus'}>
        {insertSpaceBeforeCapitalLetter(bountyStatus)}
        <LabelHelp
          help={statusHelpMessages.current[bountyStatus]}
        />
      </div>
      {proposals && (
        <div>
          <ExtendedStatus
            blocksUntilPayout={blocksUntilPayout}
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
    align-items: center;
  }
`);
