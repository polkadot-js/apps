// Copyright 2017-2024 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types.js';

import { externalSubidSVG } from '../ui/logos/external/index.js';

export const SubId: ExternalDef = {
  chains: {
    Acala: 'acala',
    Altair: 'altair',
    Astar: 'astar',
    Basilisk: 'basilisk',
    Bifrost: 'bifrost',
    Centrifuge: 'centrifuge',
    'Centrifuge Mainnet': 'centrifuge',
    ChainX: 'chainx',
    'Composable Finance': 'composable',
    Edgeware: 'edgeware',
    HydraDX: 'hydradx',
    Interlay: 'interlay',
    InvArch: 'invarch',
    'KILT Spiritnet': 'kilt',
    Karura: 'karura',
    Khala: 'khala',
    Kusama: 'kusama',
    Nodle: 'nodle',
    Picasso: 'picasso',
    'Pioneer Network': 'pioneer',
    Polkadot: 'polkadot',
    SORA: 'sora-substrate',
    Shiden: 'shiden',
    Statemine: 'statemine',
    Statemint: 'statemint',
    Subsocial: 'subsocial',
    Zeitgeist: 'zeitgeist'
  },
  create: (_chain: string, _path: string, data: BN | number | string): string =>
    `https://sub.id/${data.toString()}`,
  homepage: 'https://sub.id',
  isActive: true,
  paths: {
    address: 'account'
  },
  ui: {
    logo: externalSubidSVG
  }
};
