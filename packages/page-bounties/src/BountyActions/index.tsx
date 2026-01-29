// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { Balance, BountyIndex } from '@polkadot/types/interfaces';
import type { PalletBountiesBountyStatus } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { useBountyStatus } from '../hooks/index.js';
import AwardBounty from './AwardBounty.js';
import BountyAcceptCurator from './BountyAcceptCurator.js';
import BountyClaimAction from './BountyClaimAction.js';
import BountyInitiateVoting from './BountyInitiateVoting.js';
import ProposeCuratorAction from './ProposeCuratorAction.js';

interface Props {
  bestNumber: BN;
  description: string;
  fee?: BN;
  index: BountyIndex;
  proposals?: DeriveCollectiveProposal[];
  status: PalletBountiesBountyStatus;
  value: Balance;
}

export function BountyActions ({ bestNumber, description, fee, index, proposals, status, value }: Props): React.ReactElement<Props> {
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
