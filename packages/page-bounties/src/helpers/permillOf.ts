// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import { BN_MILLION } from '@polkadot/util';

export function permillOf (value: BN, perMill: BN): BN {
  return value.mul(perMill).div(BN_MILLION);
}
