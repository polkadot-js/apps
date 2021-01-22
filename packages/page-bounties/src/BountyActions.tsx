// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { Balance, BlockNumber, BountyIndex, BountyStatus } from '@polkadot/types/interfaces';

import React, { useCallback, useMemo } from 'react';

import BountyClaimAction from './BountyClaimAction';
import BountyCuratorProposedActions from './BountyCuratorProposedActions';
import BountyInitiateVoting from './BountyInitiateVoting';
import CloseBounty from './CloseBounty';
import ExtendBountyExpiryAction from './ExtendBountyExpiryAction';
import { getBountyStatus } from './helpers';
import ProposeCuratorAction from './ProposeCuratorAction';

interface Props {
  bestNumber: BlockNumber;
  description: string;
  index: BountyIndex;
  proposals?: DeriveCollectiveProposal[];
  status: BountyStatus;
  value: Balance;
}

export function BountyActions ({ bestNumber, description, index, proposals, status, value }: Props): JSX.Element {
  const updateStatus = useCallback(() => getBountyStatus(status), [status]);

  const { beneficiary, curator, unlockAt } = updateStatus();

  const blocksUntilPayout = useMemo(() => unlockAt?.sub(bestNumber), [bestNumber, unlockAt]);

  return (
    <>
      {status.isProposed &&
        <BountyInitiateVoting
          index={index}
          proposals={proposals}
        />
      }
      {status.isFunded &&
        <ProposeCuratorAction
          description={description}
          index={index}
          proposals={proposals}
          value={value}
        />
      }
      {status.isCuratorProposed && curator &&
        <BountyCuratorProposedActions
          curatorId={curator}
          index={index}
        />
      }
      {status.isActive && curator &&
          <ExtendBountyExpiryAction
            curatorId={curator}
            description={description}
            index={index}
          />
      }
      {(status.isFunded || status.isActive || status.isCuratorProposed) &&
        <CloseBounty
          index={index}
          proposals={proposals}
        />
      }
      {status.isPendingPayout && beneficiary && blocksUntilPayout &&
        <BountyClaimAction
          beneficiaryId={beneficiary}
          index={index}
          payoutDue={blocksUntilPayout}
        />
      }
    </>
  );
}
