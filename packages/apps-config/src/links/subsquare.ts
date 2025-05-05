// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types.js';

import { externalSubsquareSVG } from '../ui/logos/external/index.js';

export const Subsquare: ExternalDef = {
  chains: {
    Acala: 'acala',
    'Ajuna Polkadot': 'ajuna',
    Altair: 'altair',
    Astar: 'astar',
    Basilisk: 'basilisk',
    Bifrost: 'bifrost-kusama',
    'Bifrost Polkadot': 'bifrost-polkadot',
    Centrifuge: 'centrifuge',
    Collectives: 'collectives',
    Crust: 'crust',
    Heima: 'heima',
    Hydration: 'hydration',
    Interlay: 'interlay',
    Karura: 'karura',
    Khala: 'khala',
    Kusama: 'kusama',
    'Paseo Testnet': 'paseo',
    Phala: 'phala',
    Polkadot: 'polkadot',
    'Shibuya Testnet': 'shibuya',
    'Vara Network': 'vara',
    Westend: 'westend',
    Zeitgeist: 'zeitgeist',
    kintsugi: 'kintsugi'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://${chain}.subsquare.io/${path}/${data.toString()}${path === 'user' ? '/votes' : ''}`,
  homepage: 'https://subsquare.io/',
  isActive: true,
  paths: {
    address: 'user',
    bounty: 'treasury/bounty',
    council: 'council/motion',
    democracyExternal: 'democracy/external',
    democracyProposal: 'democracy/proposal',
    democracyReferendum: 'democracy/referendum',
    fellowshipReferenda: 'fellowship/referendum',
    referenda: 'referenda/referendum',
    tip: 'treasury/tip',
    treasury: 'treasury/proposal'
  },
  ui: {
    logo: externalSubsquareSVG
  }
};
