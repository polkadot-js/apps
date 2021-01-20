// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyStatus } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { bestValidProposalName } from './helpers/extendedStatuses';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  proposals: DeriveCollectiveProposal[];
  status: BountyStatus;
}

function VotingDescription ({ className = '', proposals, status }: Props): React.ReactElement<Props> {
  const bestProposalName = bestValidProposalName(proposals, status);
  const { t } = useTranslation();
  const descriptions: Record<string, string> = useMemo(() => ({
    approveBounty: t('Approval under voting'),
    closeBounty: t('Rejection under voting'),
    proposeCurator: t('Curator under voting'),
    unassignCurator: t('Unassign curator under voting')
  }), [t]);

  return (
    <>
      {bestProposalName && (
        <div
          className={className}
          data-testid='extendedStatus'
        >
          <>{descriptions[bestProposalName] || null}</>
        </div>
      )}
    </>
  );
}

export default React.memo(styled(VotingDescription)`
  font-size: 0.7rem;
  color: #8B8B8B;
  margin-top: 10px;
`);
