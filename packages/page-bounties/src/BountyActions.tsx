// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber, BountyStatus } from '@polkadot/types/interfaces';

import React, { useCallback, useMemo } from 'react';

import BountyClaimAction from './BountyClaimAction';
import BountyCuratorProposedActions from './BountyCuratorProposedActions';
import { getBountyStatus } from './helpers';

interface Props {
  bestNumber: BlockNumber;
  index: number;
  status: BountyStatus;
}

export function BountyActions ({ bestNumber, index, status }: Props): JSX.Element {
  const updateStatus = useCallback(() => getBountyStatus(status), [status]);

  const { beneficiary, curator, unlockAt } = updateStatus();

  const blocksUntilPayout = useMemo(() => unlockAt?.sub(bestNumber), [bestNumber, unlockAt]);

  return (
    <>
      {status.isCuratorProposed && curator &&
        <BountyCuratorProposedActions
          curatorId={curator}
          index={index}
        />}
      {status.isPendingPayout && beneficiary && blocksUntilPayout &&
        <BountyClaimAction
          beneficiaryId={beneficiary}
          index={index}
          payoutDue={blocksUntilPayout}
        />}
    </>
  );
}
