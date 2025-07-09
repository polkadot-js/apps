// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletNominationPoolsPoolMember } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

export interface AccountInfo {
  claimable: BN;
  member: PalletNominationPoolsPoolMember;
}
