// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types';

import { externalLogos } from '../ui/logos';

export const PolkassemblyIo: ExternalDef = {
  chains: {
    Altair: 'Altair',
    Astar: 'astar',
    'Bifrost Polkadot': 'bifrost',
    Calamari: 'calamari',
    'Centrifuge Mainnet': 'centrifuge',
    Khala: 'khala',
    Kusama: 'kusama',
    'Kusama CC3': 'kusama',
    Parallel: 'parallel',
    'Parallel Heiko': 'heiko',
    'Pioneer Network': 'pioneer',
    Polkadex: 'polkadex',
    Polkadot: 'polkadot',
    Robonomics: 'robonomics',
    Shibuya: 'shibuya',
    Shiden: 'shiden'
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
    referenda: 'referenda',
    tip: 'tip',
    treasury: 'treasury'
  },
  uiLogo: externalLogos.polkassembly as string
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
