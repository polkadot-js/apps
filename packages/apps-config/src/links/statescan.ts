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
    'InvArch Network': 'invarch',
    Kusama: 'kusama',
    'Kusama Asset Hub': 'assethub-kusama',
    'Kusama BridgeHub': 'bridgehub-kusama',
    'Kusama People': 'people-kusama',
    'Laos Network': 'laos',
    'Paseo Testnet': 'paseo',
    Polkadot: 'polkadot',
    'Polkadot Asset Hub': 'assethub-polkadot',
    'Polkadot BridgeHub': 'bridgehub-polkadot',
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
