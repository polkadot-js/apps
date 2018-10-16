// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';
import { UInt } from '@polkadot/types/codec';

import decimalFormat from './decimalFormat';

type Divisor = {
  power: number,
  text: string,
  type: string
};

const SI: Array<Divisor> = [
  { power: -24, type: 'y', text: 'yocto' },
  { power: -21, type: 'z', text: 'zepto' },
  { power: -18, type: 'a', text: 'atto' },
  { power: -15, type: 'f', text: 'femto' },
  { power: -12, type: 'p', text: 'pico' },
  { power: -9, type: 'n', text: 'nano' },
  { power: -6, type: 'µ', text: 'micro' },
  { power: -3, type: 'm', text: 'milli' },
  { power: 0, type: '', text: '' }, // position 8
  { power: 3, type: 'k', text: 'Kilo' },
  { power: 6, type: 'M', text: 'Mega' },
  { power: 9, type: 'G', text: 'Giga' },
  { power: 12, type: 'T', text: 'Tera' },
  { power: 15, type: 'P', text: 'Peta' },
  { power: 18, type: 'E', text: 'Exa' },
  { power: 21, type: 'Z', text: 'Zeta' },
  { power: 24, type: 'Y', text: 'Yotta' }
];

let defaultDecimals = 0;

export default function balanceFormat (input: string | BN | UInt, decimals: number = defaultDecimals): string {
  const text = (input || '').toString();

  if (text.length === 0) {
    return text;
  }

  const si = SI[8 + Math.floor((text.length - decimals) / 3)];
  const length = decimals + si.power;
  const mid = text.length - length;
  const prefix = text.substr(0, mid);
  const postfix = `${text.substr(mid)}000`.substr(0, 3);

  return `${decimalFormat(prefix || '0')}.${postfix}${si.type}`;
}

balanceFormat.setDefaultDecimals = (decimals: number): void => {
  defaultDecimals = decimals;
};
