// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types.js';

import { externalStatescanSVG } from '../ui/logos/external/index.js';

export const Statescan: ExternalDef = {
  chains: {
    Collectives: 'Collectives',
    Crust: 'crust-parachain',
    'Crust Shadow': 'shadow',
    Heima: 'heima',
    'Hyperbridge (Nexus)': 'nexus',
    'Hyperbridge (gargantua)': 'gargantua',
    'InvArch Network': 'invarch',
    Kusama: 'kusama',
    'Kusama Asset Hub': 'assethub-kusama',
    'Kusama BridgeHub': 'bridgehub-kusama',
    'Kusama Coretime': 'coretime-kusama',
    'Kusama People': 'people-kusama',
    'Laos Network': 'laos',
    'Paseo Testnet': 'paseo',
    'Polimec Polkadot': 'polimec',
    Polkadot: 'polkadot',
    'Polkadot Asset Hub': 'assethub-polkadot',
    'Polkadot BridgeHub': 'bridgehub-polkadot',
    'Polkadot Coretime': 'coretime-polkadot',
    'Polkadot People': 'people-polkadot',
    'Tangle Mainnet': 'tangle',
    'Westend Asset Hub': 'assethub-westend'
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
