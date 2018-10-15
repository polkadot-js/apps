// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';
import { UInt } from '@polkadot/types/codec';
import bnToBn from '@polkadot/util/bn/toBn';

import decimalFormat from './decimalFormat';

function toDecimal (value: string, split: number, indicator: string): string {
  const postfix = split === 0
    ? ''
    : `.${value.slice(-1 * split).substr(0, 2)}`;
  const prefix = value.slice(0, value.length - split);

  return `${decimalFormat(prefix)}${postfix}${indicator}`;
}

export default function balanceFormat (_value?: UInt | BN | number | null): string {
  if (_value === undefined || _value === null) {
    return '0';
  }

  const value = _value instanceof UInt
    ? _value.toBn().toString()
    : bnToBn(_value).toString();

  // FIXME We need to handle denominations properly on a pre-chain basis
  return toDecimal(value, 0, '');

  // if (value.length <= 6) {
  //   return toDecimal(value, 0, 'μ');
  // } else if (value.length <= 9) {
  //   return toDecimal(value, 6, '');
  // } else if (value.length <= 12) {
  //   return toDecimal(value, 9, 'k');
  // }

  // return toDecimal(value, 12, 'M');
}
