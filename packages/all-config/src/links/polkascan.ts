// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';

export default {
  isActive: true,
  chains: {
    Edgeware: 'edgeware',
    Kulupu: 'kulupu',
    Kusama: 'kusama',
    'Kusama CC3': 'kusama',
    Westend: 'westend'
  },
  paths: {
    address: 'module/account',
    block: 'system/block',
    council: 'council/motion',
    extrinsic: 'system/extrinsic',
    proposal: 'democracy/proposal',
    referendum: 'democracy/referendum',
    treasury: 'treasury/proposal'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://polkascan.io/pre/${chain}/${path}/${data.toString()}`
};
