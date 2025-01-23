// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletBountiesBountyStatus } from '@polkadot/types/lookup';
import type { BountyStatusType, StatusName } from '../types.js';

export const getBountyStatus = (status: PalletBountiesBountyStatus): BountyStatusType => {
  const statusAsString = status.type as StatusName;

  let result: BountyStatusType = {
    beneficiary: undefined,
    bountyStatus: statusAsString,
    curator: undefined,
    unlockAt: undefined,
    updateDue: undefined
  };

  if (status.isCuratorProposed) {
    result = {
      ...result,
      bountyStatus: 'CuratorProposed',
      curator: status.asCuratorProposed.curator
    };
  }

  if (status.isActive) {
    result = {
      ...result,
      curator: status.asActive.curator,
      updateDue: status.asActive.updateDue
    };
  }

  if (status.isPendingPayout) {
    result = {
      ...result,
      beneficiary: status.asPendingPayout.beneficiary,
      bountyStatus: 'PendingPayout',
      curator: status.asPendingPayout.curator,
      unlockAt: status.asPendingPayout.unlockAt
    };
  }

  return result;
};
