// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import { externalLogos } from '../ui/logos';

export default {
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
    Polkadot: 'polkadot',
    SORA: 'sora-substrate',
    Shiden: 'shiden',
    Statemine: 'statemine',
    Subsocial: 'subsocial'
  },
  create: (_chain: string, _path: string, data: BN | number | string): string =>
    `https://sub.id/#/${data.toString()}`,
  isActive: true,
  logo: externalLogos.subid as string,
  paths: {
    address: 'account'
  },
  url: 'https://sub.id'
};
