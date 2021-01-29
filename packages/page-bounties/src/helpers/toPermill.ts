// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

export function toPermill (value: BN, perMill: BN): BN {
  return value.mul(perMill).div(new BN(1_000_000));
}
