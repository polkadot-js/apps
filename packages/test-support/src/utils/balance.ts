// Copyright 2017-2022 @polkadot/test-supports authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Balance } from '@polkadot/types/interfaces';
import { BN, formatBalance } from '@polkadot/util';

import { balanceOf } from '../creation/balance';

/**
 * Creates a balance instance for testing purposes which most often do not need to specifiy/use decimal part.
 * @param amountInt Integer part of the balance number
 * @param decimalsString Decimals part of the balance number. Note! This is a string sequence just after '.' separator
 *  that is the point that separates integers from decimals. E.g. (100, 4567) => 100.45670000...00
 */
export function balance (amountInt: number, decimalsString?: string): Balance {
  const decimalsPadded = (decimalsString || '').padEnd(12, '0');

  return balanceOf(amountInt.toString() + decimalsPadded);
}

export function showBalance (amount: number): string {
  return format(balance(amount));
}

export function format (amount: Balance | BN): string {
  return formatBalance(amount, { decimals: 12, forceUnit: '-', withUnit: true });
}
