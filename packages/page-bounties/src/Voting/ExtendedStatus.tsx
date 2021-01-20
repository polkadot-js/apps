// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyStatus } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useRef } from 'react';

import { BN_ZERO } from '@polkadot/util';

import Description from '../Description';
import { bestValidProposalName } from '../helpers/extendedStatuses';
import { useTranslation } from '../translate';

interface Props {
  blocksUntilPayout?: BN ;
  className?: string;
  proposals?: DeriveCollectiveProposal[];
  status: BountyStatus;
}

function ExtendedStatus ({ blocksUntilPayout, className = '', proposals, status }: Props): React.ReactElement<Props> {
  const bestProposalName = proposals ? bestValidProposalName(proposals, status) : null;
  const { t } = useTranslation();
  const votingDescriptions = useRef<Record<string, string>>({
    approveBounty: t('Approval under voting'),
    closeBounty: t('Rejection under voting'),
    proposeCurator: t('Curator under voting'),
    unassignCurator: t('Unassign curator under voting')
  });

  return (
    <>
      {bestProposalName && votingDescriptions.current[bestProposalName] &&
        <Description
          className={className}
          dataTestId='extendedVotingStatus'
          description={votingDescriptions.current[bestProposalName]}
        />
      }
      {blocksUntilPayout?.lt(BN_ZERO) &&
        <Description
          className={className}
          dataTestId='extendedActionStatus'
          description={t<string>('Claimable')}
        />
      }
    </>
  );
}

export default React.memo(ExtendedStatus);
