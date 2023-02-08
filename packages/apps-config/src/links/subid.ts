// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types';

import { externalSubidSVG } from '../ui/logos/external';

export const SubId: ExternalDef = {
  chains: {
    Altair: 'altair',
    Bifrost: 'bifrost',
    Centrifuge: 'centrifuge',
    'Centrifuge Mainnet': 'centrifuge',
    ChainX: 'chainx',
    Edgeware: 'edgeware',
    Karura: 'karura',
    Khala: 'khala',
    Kusama: 'kusama',
    'Pioneer Network': 'pioneer',
    Polkadot: 'polkadot',
    SORA: 'sora-substrate',
    Shiden: 'shiden',
    Statemine: 'statemine',
    Subsocial: 'subsocial'
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
