// Copyright 2017-2020 @canvas-ui/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

export default {
  chains: {
    'Centrifuge Mainnet': 'centrifuge',
    Edgeware: 'edgeware',
    Kulupu: 'kulupu',
    Kusama: 'kusama',
    'Kusama CC3': 'kusama',
    'Polkadot CC1': 'polkadot-cc1'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://polkascan.io/${chain}/${path}/${data.toString()}`,
  isActive: true,
  paths: {
    address: 'account',
    block: 'block',
    council: 'council/motion',
    extrinsic: 'transaction',
    proposal: 'democracy/proposal',
    referendum: 'democracy/referendum',
    techcomm: 'techcomm/proposal',
    treasury: 'treasury/proposal'
  },
  url: 'https://polkascan.io/'
};
