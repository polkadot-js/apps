// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

export function balanceToNumber (amount: BN, divisor: BN): number {
  return amount.muln(1000).div(divisor).toNumber() / 1000;
}
