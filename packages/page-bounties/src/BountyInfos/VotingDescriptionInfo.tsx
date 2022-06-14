// Copyright 2017-2022 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyStatus } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';
import styled from 'styled-components';

import { LabelHelp } from '@polkadot/react-components';

import { proposalNameToDisplay } from '../helpers/extendedStatuses';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
  proposal: DeriveCollectiveProposal;
  status: BountyStatus;
}

function VotingDescriptionInfo ({ className, proposal, status }: Props): React.ReactElement<Props> {
  const bestProposalName = proposalNameToDisplay(proposal, status);
  const { t } = useTranslation();
  const votingDescriptions = useRef<Record<string, string>>({
    approveBounty: t('Bounty approval under voting'),
    closeBounty: t('Bounty rejection under voting'),
    proposeCurator: t('Curator proposal under voting'),
    slashCurator: t('Curator slash under voting'),
    unassignCurator: t('Unassign curator under voting')
  });

  return (
    <div
      className={className}
      data-testid='voting-description'
    >
      {bestProposalName && votingDescriptions.current[bestProposalName] &&
        <LabelHelp help={votingDescriptions.current[bestProposalName]} />
      }
    </div>
  );
}

export default React.memo(styled(VotingDescriptionInfo)`
  margin-left: 0.2rem;
`);
