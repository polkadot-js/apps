// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import { externalLogos } from '../ui/logos';

export default {
  chains: {
    Acala: 'acala',
    Altair: 'altair',
    //Ares: 'ares',
    Astar: 'astar',
    Basilisk: 'basilisk',
    Bifrost: 'bifrost-ksm',
    'Bifrost Polkadot': 'bifrost-dot',
    'Calamari Parachain': 'calamari',
    Centrifuge: 'centrifuge', 
    'Composable Finance': 'composable', 
    Clover: 'clover',
    'Crust Shadow': 'shadow', 
    'Crab Parachain': 'crab', 
    'Dorafactory Network': 'dorafactory', 
    'Encointer on Kusama': 'encointer',
    Efinity: 'efinity',
    'Equilibrium parachain': 'equilibrium',
    HydraDX: 'hydradx',
    'Integritee Network (Kusama)': 'integritee',
    Interlay: 'interlay',
    'KILT Spiritnet': 'spiritnet',
    Karura: 'karura',
    Khala: 'khala',
    KICO: 'kico',
    kintsugi: 'kintsugi',
    Kusama: 'kusama',
    // 'Listen Network': 'listen',
    Litentry: 'litentry',
    Litmus: 'litmus',
    // Mars: 'mars',
    'Mangata Kusama Mainnet': 'mangatax',
    Moonbeam: 'moonbeam',
    Moonriver: 'moonriver',
    'Nodle Parachain': 'nodle',
    'OriginTrail Parachain': 'origintrail',
    Parallel: 'parallel',
    'Parallel Heiko': 'parallel-heiko',
    // Phala: 'phala',
    Picasso: 'picasso',
    'Pichiu Network': 'pichiu',
    'Pioneer Network': 'bitcountrypioneer',
    // Polkadex: 'polkadex',
    Polkadot: 'polkadot',
    'QUARTZ by UNIQUE': 'quartz',
    Robonomics: 'robonomics',
    // SORA: 'sora',
    Shiden: 'shiden',
    Statemine: 'statemine',
    Statemint: 'statemint',
    //'SubGame Gamma': 'subgame-gamma',
    SubsocialX: 'subsocialx',
    //Tanganika: 'tanganika',
    'Turing Network': 'turing',
    'UNIQUE': 'unique',
    //Unorthodox: 'unorthodox',
    Zeitgeist: 'zeitgeist'
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
