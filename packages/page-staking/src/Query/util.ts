// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import { BigNumber } from "bignumber.js";

import { BN_THOUSAND, BN_ZERO, isBn, isFunction } from '@polkadot/util';

interface ToBN {
  toBn: () => BN;
}

export function balanceToNumber (amount: BN | ToBN = BN_ZERO, divisor: BN): number {
  const value = isBn(amount)
    ? amount
    : isFunction(amount.toBn)
      ? amount.toBn()
      : BN_ZERO;

  return value.mul(BN_THOUSAND).div(divisor).toNumber() / 1000;
}

export const formatDarwiniaPower = (power: BN| undefined, unit?: string): string => {
  if(!power) {
    return ''
  }
  return `${new BigNumber(power.toString()).toFormat(0)} ${unit}`;
}
