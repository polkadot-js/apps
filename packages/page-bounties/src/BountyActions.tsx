// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber, BountyStatus } from '@polkadot/types/interfaces';

import React, { useCallback, useMemo } from 'react';

import { useMembers } from '@polkadot/react-hooks';

import BountyClaimAction from './BountyClaimAction';
import BountyCuratorProposedActions from './BountyCuratorProposedActions';
import BountyInitiateVoting from './BountyInitiateVoting';
import { getBountyStatus } from './helpers';

interface Props {
  bestNumber: BlockNumber;
  index: number;
  status: BountyStatus;
}

export function BountyActions ({ bestNumber, index, status }: Props): JSX.Element {
  const { isMember, members } = useMembers();

  const updateStatus = useCallback(() => getBountyStatus(status), [status]);

  const { beneficiary, curator, unlockAt } = updateStatus();

  const blocksUntilPayout = useMemo(() => unlockAt?.sub(bestNumber), [bestNumber, unlockAt]);

  return (
    <>
      {status.isProposed &&
        <BountyInitiateVoting
          index={index}
          isMember={isMember}
          members={members}
        />}
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
