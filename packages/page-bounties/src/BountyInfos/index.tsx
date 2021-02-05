// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { AccountId, BountyStatus } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import { AddressSmall } from '@polkadot/react-components';
import { BN_HUNDRED } from '@polkadot/util';

import Description from '../Description';
import { getProposalToDisplay } from '../helpers/extendedStatuses';
import { useBounties } from '../hooks';
import { useTranslation } from '../translate';
import VotingLink from '../Voting/VotingLink';
import BountyInfo from './BountyInfo';
import VotingSummary from './VotingSummary';

interface Props {
  beneficiary?: AccountId;
  blocksUntilUpdate?: BN;
  className?: string;
  proposals?: DeriveCollectiveProposal[];
  status: BountyStatus;
}

export const BLOCKS_PERCENTAGE_LEFT_TO_SHOW_WARNING = 10;
const BLOCKS_LEFT_TO_SHOW_WARNING = new BN('10000');

function BountyInfos ({ beneficiary, blocksUntilUpdate, className, proposals, status }: Props): JSX.Element {
  const { t } = useTranslation();

  const { bountyUpdatePeriod } = useBounties();

  const blocksPercentageLeftToShowWarning = bountyUpdatePeriod?.muln(BLOCKS_PERCENTAGE_LEFT_TO_SHOW_WARNING).div(BN_HUNDRED);
  const blocksToShowWarning = blocksPercentageLeftToShowWarning ?? BLOCKS_LEFT_TO_SHOW_WARNING;
  const proposalToDisplay = useMemo(() => proposals && getProposalToDisplay(proposals, status), [proposals, status]);

  return (
    <div className={className}>
      {proposalToDisplay && <VotingSummary proposal={proposalToDisplay}/>}
      {proposalToDisplay && <VotingLink />}
      {beneficiary && (
        <div>
          <AddressSmall value={beneficiary} />
          <Description description={t<string>('Beneficiary')} />
        </div>
      )}
      {blocksUntilUpdate?.lt(blocksToShowWarning) && (
        <BountyInfo
          description={t<string>('Close deadline')}
          type='warning'
        />
      )}
      {status.isApproved && (
        <BountyInfo
          description={t<string>('Waiting for Bounty Funding')}
          type='info'
        />
      )}
      {status.isCuratorProposed && (
        <BountyInfo
          description={t<string>("Waiting for Curator's acceptance")}
          type='info'
        />
      )}
    </div>
  );
}

export default React.memo(styled(BountyInfos)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`);
