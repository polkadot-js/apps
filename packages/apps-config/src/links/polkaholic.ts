// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import { externalLogos } from '../ui/logos';

export default {
  chains: {
    Acala: 'acala',
    Altair: 'altair',
    Astar: 'astar',
    Basilisk: 'basilisk',
    Bifrost: 'bifrost-ksm',
    'Bifrost Polkadot': 'bifrost-dot',
    'Calamari Parachain': 'calamari',
    Centrifuge: 'centrifuge',
    Clover: 'clover',
    'Composable Finance': 'composable',
    'Crab Parachain': 'crab',
    'Crust Shadow': 'shadow',
    'Dorafactory Network': 'dorafactory',
    Efinity: 'efinity',
    'Encointer on Kusama': 'encointer',
    'Equilibrium parachain': 'equilibrium',
    HydraDX: 'hydradx',
    'Integritee Network (Kusama)': 'integritee',
    Interlay: 'interlay',
    KICO: 'kico',
    'KILT Spiritnet': 'spiritnet',
    Karura: 'karura',
    Khala: 'khala',
    Kusama: 'kusama',
    Litentry: 'litentry',
    Litmus: 'litmus',
    'Mangata Kusama Mainnet': 'mangatax',
    Moonbeam: 'moonbeam',
    Moonriver: 'moonriver',
    'Nodle Parachain': 'nodle',
    'OAK Network': 'oak',
    'OriginTrail Parachain': 'origintrail',
    Parallel: 'parallel',
    'Parallel Heiko': 'parallel-heiko',
    Picasso: 'picasso',
    'Pichiu Network': 'pichiu',
    'Pioneer Network': 'bitcountrypioneer',
    Polkadot: 'polkadot',
    'QUARTZ by UNIQUE': 'quartz',
    Robonomics: 'robonomics',
    Shiden: 'shiden',
    Statemine: 'statemine',
    Statemint: 'statemint',
    SubsocialX: 'subsocialx',
    'Turing Network': 'turing',
    UNIQUE: 'unique',
    Zeitgeist: 'zeitgeist',
    kintsugi: 'kintsugi'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://${chain}.polkaholic.io/${path}/${data.toString()}`,
  isActive: true,
  logo: externalLogos.polkaholic as string,
  paths: {
    address: 'account',
    block: 'blockhash',
    extrinsic: 'tx'
  },
  url: 'https://polkaholic.io/'
};
