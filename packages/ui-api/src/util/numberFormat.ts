// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import { Compact } from '@polkadot/types/codec';
import { bnToBn } from '@polkadot/util';

import decimalFormat from './decimalFormat';

export default function numberFormat (_value?: Compact | BN | number | null): string {
  if (!_value) {
    return '0';
  }

  const value = _value instanceof Compact
    ? _value.toBn()
    : bnToBn(_value);

  return decimalFormat(value.toString());
}
