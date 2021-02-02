// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

import { BN_ZERO } from '@polkadot/util';

export function getMoreThanThresholdMembersCount (membersCount: number, thresholdRate: number): BN {
  if (membersCount === 0) { return BN_ZERO; }

  const atLeastThreshold = getAtLeastThresholdMembersCount(membersCount, thresholdRate).toNumber();

  return atLeastThreshold === membersCount * thresholdRate
    ? new BN(atLeastThreshold + 1)
    : new BN(atLeastThreshold);
}

export function getAtLeastThresholdMembersCount (membersCount: number, thresholdRate: number): BN {
  return new BN(Math.ceil((membersCount * thresholdRate)));
}
