// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types.js';

import { externalKodadotSVG } from '../ui/logos/external/index.js';

const getNetwork = (_chain: string) => {
  const chain = {
    'kusama': 'rmrk',
    'basilisk': 'bsx',
    'statemint': 'ahp',
    'statemine': 'ahk'
  }[_chain];

  return `https://kodadot.xyz/${chain}/u/`;
};

export const KodaDot: ExternalDef = {
  chains: {
    Kusama: 'kusama',
    Basilisk: 'basilisk',
    Statemine: 'statemine',
    Statemint: 'statemint',
  },
  create: (_chain: string, _path: string, data: BN | number | string): string =>
    `${getNetwork(_chain)}${data.toString()}`,
  homepage: 'https://kodadot.xyz',
  isActive: true,
  paths: {
    address: 'account'
  },
  ui: {
    logo: externalKodadotSVG
  }
};
