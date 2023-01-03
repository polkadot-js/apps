// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import { externalLogos } from '../ui/logos';

export default {
  chains: {
    Acala: 'acala',
    'Aleph Zero Testnet': 'aleph-zero-testnet',
    Astar: 'astar',
    'Bajun Network': 'bajun',
    Bifrost: 'bifrost',
    'Calamari Parachain': 'calamari',
    Efinity: 'efinity',
    'Equilibrium parachain': 'equilibrium',
    GM: 'gmordie',
    HydraDX: 'hydradx',
    Interlay: 'interlay',
    'InvArch Tinker Network': 'invarch-tinkernet',
    Karura: 'karura',
    Khala: 'khala',
    Kusama: 'kusama',
    Litentry: 'litentry',
    Litmus: 'litmus',
    'Moonbase Alpha': 'moonbase',
    Moonbeam: 'moonbeam',
    Moonriver: 'moonriver',
    Phala: 'phala',
    Polkadot: 'polkadot',
    'QUARTZ by UNIQUE': 'quartz',
    Rococo: 'rococo',
    'Shibuya Testnet': 'shibuya',
    Shiden: 'shiden',
    Statemine: 'statemine',
    Statemint: 'statemint',
    UNIQUE: 'unique',
    crust: 'crust',
    kintsugi: 'kintsugi',
    opal: 'opal'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://calamar.app/${chain}/${path}${data.toString()}&source=polkadotjs`,
  isActive: true,
  logo: externalLogos.calamar as string,
  paths: {
    address: 'search?query=',
    block: 'search?query=',
    call: 'search?query=',
    event: 'search?query=',
    extrinsic: 'search?query='
  },
  url: 'https://calamar.app/'
};
