// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletNominationPoolsPoolMember, PalletNominationPoolsRewardPool } from '@polkadot/types/lookup';
import type { PalletNominationPoolsPoolMemberV0, PalletNominationPoolsRewardPoolV0 } from './types';

export function isPrevMember (member?: PalletNominationPoolsPoolMember | PalletNominationPoolsPoolMemberV0 | null): member is PalletNominationPoolsPoolMemberV0 {
  return !!(member && (member as PalletNominationPoolsPoolMemberV0).rewardPoolTotalEarnings);
}

export function isPrevPool (pool?: PalletNominationPoolsRewardPool | PalletNominationPoolsRewardPoolV0 | null): pool is PalletNominationPoolsRewardPoolV0 {
  return !!(pool && (pool as PalletNominationPoolsRewardPoolV0).totalEarnings);
}
