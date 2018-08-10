// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';

const NUMBER_REGEX = new RegExp('(\\d+?)(?=(\\d{3})+(?!\\d)|$)', 'g');

export default function numberFormat (value?: BN | number): string {
  if (value === undefined || value === null) {
    return '0';
  }

  return ((value as number).toString().match(NUMBER_REGEX) || []).join(',');
}
