// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import { UInt } from '@polkadot/types/codec';

import decimalFormat from './decimalFormat';

export default function numberFormat (value?: UInt | BN | number | null): string {
  if (value === undefined || value === null) {
    return '0';
  }

  return decimalFormat((value as number).toString());
}
