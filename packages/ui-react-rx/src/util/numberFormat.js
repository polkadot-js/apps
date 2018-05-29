// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type BN from 'bn.js';

const NUMBER_REGEX = new RegExp('(\\d+?)(?=(\\d{3})+(?!\\d)|$)', 'g');

export default function numberFormat (value?: BN | number): string {
  if (value === undefined) {
    return '0';
  }

  return (value.toString().match(NUMBER_REGEX) || []).join(',');
}
