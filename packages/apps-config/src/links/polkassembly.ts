// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types.js';

import { externalPolkassemblyPNG } from '../ui/logos/external/index.js';

export const PolkassemblyIo: ExternalDef = {
  chains: {
    Acala: 'acala',
    Altair: 'altair',
    Astar: 'astar',
    Basilisk: 'basilisk',
    'Bifrost Polkadot': 'bifrost',
    Calamari: 'calamari',
    Centrifuge: 'centrifuge',
    'Centrifuge Mainnet': 'centrifuge',
    Collectives: 'collectives',
    'Equilibrium parachain': 'equilibrium',
    'Hashed Network': 'hashed',
    HydraDX: 'hydradx',
    'Integritee Network (Kusama)': 'integritee',
    Khala: 'khala',
    Kusama: 'kusama',
    'Kusama CC3': 'kusama',
    Parallel: 'parallel',
    'Parallel Heiko': 'heiko',
    Picasso: 'picasso',
    'Pioneer Network': 'pioneer',
    Polkadex: 'polkadex',
    Polkadot: 'polkadot',
    Robonomics: 'robonomics',
    Shibuya: 'shibuya',
    Shiden: 'shiden',
    'Westend Collectives': 'westend-collectives'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://${chain}.polkassembly.io/${path}/${data.toString()}`,
  homepage: 'https://polkassembly.io/',
  isActive: true,
  paths: {
    bounty: 'bounty',
    council: 'motion',
    democracyProposal: 'proposal',
    democracyReferendum: 'referendum',
    fellowshipReferenda: 'member-referenda',
    referenda: 'referenda',
    tip: 'tip',
    treasury: 'treasury'
  },
  ui: {
    logo: externalPolkassemblyPNG
  }
};

export const PolkassemblyNetwork: ExternalDef = {
  ...PolkassemblyIo,
  chains: {
    Bifrost: 'bifrost',
    'KILT Spiritnet': 'kilt',
    Karura: 'karura',
    'Khala Network': 'khala',
    'Moonbase Alpha': 'moonbase',
    Moonbeam: 'moonbeam',
    Moonriver: 'moonriver'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://${chain}.polkassembly.network/${path}/${data.toString()}`,
  homepage: 'https://polkassembly.network/'
};
