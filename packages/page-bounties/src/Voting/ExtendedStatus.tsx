// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyStatus } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import { BN_ZERO } from '@polkadot/util';

import { bestValidProposalName } from '../helpers/extendedStatuses';
import { useTranslation } from '../translate';

interface Props {
  blocksUntilPayout?: BN ;
  className?: string;
  proposals: DeriveCollectiveProposal[];
  status: BountyStatus;
}

function ExtendedStatus ({ blocksUntilPayout, className = '', proposals, status }: Props): React.ReactElement<Props> {
  const bestProposalName = bestValidProposalName(proposals, status);
  const { t } = useTranslation();
  const votingDescriptions: Record<string, string> = useMemo(() => ({
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
          data-testid='extendedVotingStatus'
        >
          {votingDescriptions[bestProposalName] || null}
        </div>
      )}
      {blocksUntilPayout?.lt(BN_ZERO) && (
        <div
          className={className}
          data-testid='extendedActionStatus'
        >
          {t('Claimable')}
        </div>
      )}
    </>
  );
}

export default React.memo(styled(ExtendedStatus)`
  margin-top: 0.28rem;
  font-size: 0.7rem;
  line-height: 0.85rem;
  color: #8B8B8B;
`);
