// Copyright 2017-2024 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types.js';

import { externalStatescanSVG } from '../ui/logos/external/index.js';

export const Statescan: ExternalDef = {
  chains: {
    Collectives: 'Collectives',
    Crust: 'crust-parachain',
    'Crust Shadow': 'shadow',
    Kusama: 'kusama',
    'Kusama Asset Hub': 'statemine',
    Litentry: 'litentry',
    Litmus: 'litmus',
    Parallel: 'parallel',
    'Parallel Heiko': 'heiko',
    Polkadot: 'polkadot',
    'Polkadot Asset Hub': 'statemint',
    'Tangle Mainnet': 'tangle',
    'Tangle Testnet': 'tangle-testnet',
    'Westend Collectives': 'westend-collectives',
    Westmint: 'westmint'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://${chain}.statescan.io/#/${path}/${data.toString()}`,
  homepage: 'https://statescan.io/',
  isActive: true,
  paths: {
    address: 'accounts',
    block: 'blocks'
  },
  ui: {
    logo: externalStatescanSVG
  }
};
