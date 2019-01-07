// Copyright 2017-2019 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';

import decimalFormat from './decimalFormat';

export default function numberFormat (value?: BN | number | null): string {
  if (!value) {
    return '0';
  }

  return decimalFormat((value as number).toString());
}
