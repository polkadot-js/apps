// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { PalletBountiesBountyStatus } from '@polkadot/types/lookup';

import React, { useRef } from 'react';

import { LabelHelp, styled } from '@polkadot/react-components';

import { proposalNameToDisplay } from '../helpers/extendedStatuses.js';
import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  proposal: DeriveCollectiveProposal;
  status: PalletBountiesBountyStatus;
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
    <StyledDiv
      className={className}
      data-testid='voting-description'
    >
      {bestProposalName && votingDescriptions.current[bestProposalName] &&
        <LabelHelp help={votingDescriptions.current[bestProposalName]} />
      }
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  margin-left: 0.2rem;
`;

export default React.memo(VotingDescriptionInfo);
