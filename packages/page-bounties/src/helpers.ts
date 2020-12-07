// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BountyStatus } from '@polkadot/types/interfaces';

import { BountyStatusType } from './types';

export const getBountyStatus = (status: BountyStatus): BountyStatusType => {
  const statusAsString = status.type;

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

  return result;
};
