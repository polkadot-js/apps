// Copyright 2017-2022 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { Balance, BlockNumber, BountyIndex, BountyStatus } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { useBountyStatus } from '../hooks';
import AwardBounty from './AwardBounty';
import BountyAcceptCurator from './BountyAcceptCurator';
import BountyClaimAction from './BountyClaimAction';
import BountyInitiateVoting from './BountyInitiateVoting';
import ProposeCuratorAction from './ProposeCuratorAction';

interface Props {
  bestNumber: BlockNumber;
  description: string;
  fee?: BN;
  index: BountyIndex;
  proposals?: DeriveCollectiveProposal[];
  status: BountyStatus;
  value: Balance;
}

export function BountyActions ({ bestNumber, description, fee, index, proposals, status, value }: Props): JSX.Element {
  const { beneficiary, curator, unlockAt } = useBountyStatus(status);
  const blocksUntilPayout = useMemo(() => unlockAt?.sub(bestNumber), [bestNumber, unlockAt]);

  return (
    <>
      {status.isProposed &&
        <BountyInitiateVoting
          description={description}
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
      {status.isCuratorProposed && curator && fee &&
        <BountyAcceptCurator
          curatorId={curator}
          description={description}
          fee={fee}
          index={index}
        />
      }
      {status.isPendingPayout && beneficiary && blocksUntilPayout &&
        <BountyClaimAction
          beneficiaryId={beneficiary}
          index={index}
          payoutDue={blocksUntilPayout}
        />
      }
      {status.isActive && curator &&
        <AwardBounty
          curatorId={curator}
          description={description}
          index={index}
        />
      }
    </>
  );
}
