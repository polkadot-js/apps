// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';

import { BN_MILLION } from '@polkadot/util';

export function permillOf (value: BN, perMill: BN): BN {
  return value.mul(perMill).div(BN_MILLION);
}
