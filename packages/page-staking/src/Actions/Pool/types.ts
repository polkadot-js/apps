// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BTreeMap, u32, u128, U256 } from '@polkadot/types';
// import type { PalletNominationPoolsPoolMember } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

export interface PalletNominationPoolsPoolMemberV0 {
  readonly poolId: u32;
  readonly points: u128;
  readonly rewardPoolTotalEarnings: u128;
  readonly unbondingEras: BTreeMap<u32, u128>;
}

export interface PalletNominationPoolsRewardPoolV0 {
  readonly balance: u128;
  readonly totalEarnings: u128;
  readonly points: U256;
}

export interface AccountInfo {
  claimable: BN;
  // TODO current version rewards
  member: PalletNominationPoolsPoolMemberV0;
}
