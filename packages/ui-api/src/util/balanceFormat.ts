// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';

import decimalFormat from './decimalFormat';

type SiDef = {
  power: number,
  text: string,
  value: string
};

interface BalanceFormatter {
  (input: string | BN, withSi?: boolean, decimals?: number): string;
  findSi (type: string): SiDef;
  getDefaultDecimals (): number;
  getOptions (decimals?: number): Array<SiDef>;
  setDefaultDecimals (decimals: number): void;
}

const SI: Array<SiDef> = [
  { power: -24, value: 'y', text: 'yocto' },
  { power: -21, value: 'z', text: 'zepto' },
  { power: -18, value: 'a', text: 'atto' },
  { power: -15, value: 'f', text: 'femto' },
  { power: -12, value: 'p', text: 'pico' },
  { power: -9, value: 'n', text: 'nano' },
  { power: -6, value: 'µ', text: 'micro' },
  { power: -3, value: 'm', text: 'milli' },
  { power: 0, value: '-', text: '----' }, // position 8
  { power: 3, value: 'k', text: 'Kilo' },
  { power: 6, value: 'M', text: 'Mega' },
  { power: 9, value: 'G', text: 'Giga' },
  { power: 12, value: 'T', text: 'Tera' },
  { power: 15, value: 'P', text: 'Peta' },
  { power: 18, value: 'E', text: 'Exa' },
  { power: 21, value: 'Z', text: 'Zeta' },
  { power: 24, value: 'Y', text: 'Yotta' }
];

const SI_MID = 8;

let defaultDecimals = 0;

export function calcSi (text: string, decimals: number = defaultDecimals): SiDef {
  return SI[(SI_MID - 1) + Math.ceil((text.length - decimals) / 3)];
}

// Formats a string/number with <prefix>.<postfix><type> notation
function _balanceFormat (input: string | BN, withSi: boolean = true, decimals: number = defaultDecimals): string {
  const text = (input || '').toString();

  if (text.length === 0 || text === '0') {
    return text;
  }

  // NOTE We start at midpoint (8) minus 1 - this means that values display as
  // 123.456 instead of 0.123k (so always 6 relevant). Additionally we us ceil
  // so there are at most 3 decimal before the decimal seperator
  const si = calcSi(text, decimals);
  const mid = text.length - (decimals + si.power);
  const prefix = text.substr(0, mid);
  const postfix = `${text.substr(mid)}000`.substr(0, 3);

  return `${decimalFormat(prefix || '0')}.${postfix}${withSi ? (si.value === '-' ? '' : si.value) : ''}`;
}

const balanceFormat = _balanceFormat as BalanceFormatter;

// Given a SI type (e.g. k, m, Y) find the SI definition
balanceFormat.findSi = (type: string): SiDef => {
  return SI.find(({ value }) => value === type) || SI[SI_MID];
};

balanceFormat.getDefaultDecimals = (): number => {
  return defaultDecimals;
};

// get allowable options to display in a dropdown
balanceFormat.getOptions = (decimals: number = defaultDecimals): Array<SiDef> => {
  return SI.filter(({ power }) =>
    power < 0
      ? (decimals + power) >= 0
      : true
  );
};

// Sets the default decimals to use for formatting (chain-wide)
balanceFormat.setDefaultDecimals = (decimals: number = 0): void => {
  defaultDecimals = decimals;
};

export default balanceFormat;
