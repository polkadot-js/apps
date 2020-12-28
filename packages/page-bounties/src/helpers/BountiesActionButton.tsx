// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber, BountyStatus } from '@polkadot/types/interfaces';

import React, { useCallback, useMemo } from 'react';

import BountyClaim from '../BountyClaim';
import CuratorProposedAction from '../CuratorProposedAction';
import { getBountyStatus } from '.';

interface Props {
  bestNumber: BlockNumber;
  index: number;
  status: BountyStatus;
}

export function BountiesActionButton ({ bestNumber, index, status }: Props): JSX.Element | null {
  const updateStatus = useCallback(() => getBountyStatus(status), [status]);

  const { beneficiary, bountyStatus, curator, unlockAt } = updateStatus();

  const blocksUntilPayout = useMemo(() => unlockAt?.sub(bestNumber), [bestNumber, unlockAt]);

  switch (bountyStatus) {
    case ('Curator Proposed'):
      return curator
        ? (
          <CuratorProposedAction
            curatorId={curator}
            index={index}
          />
        )
        : null;
    case ('Pending Payout'):
      return beneficiary && blocksUntilPayout
        ? (
          <BountyClaim
            beneficiaryId={beneficiary}
            index={index}
            payoutDue={blocksUntilPayout}
          />
        )
        : null;
    default:
      return null;
  }
}
